const express = require("express")
const session = require("express-session")
const axios = require("axios")
const mongoose = require("mongoose")
const MongoDBSession = require("connect-mongodb-session")(session)
const amqp = require('amqplib/callback_api');
const app = express()

require("dotenv").config()



//---------login/logout/registration----------//

const userModel = require('./models/User.js')
const { response } = require("express")
urldb = 'mongodb://mongo:27017/sessions'

//connect DB
mongoose
    .connect(urldb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        })
    .then((res) => {
        console.log("mongoDB connected successfully")
    });

//auto store sessions
const store = new MongoDBSession({
    uri: urldb,
    collection: "mySessions",
});

app.use(express.urlencoded({extended:false}))
app.use(express.json())


//session configuration
app.use(
    session({
        secret: process.env.PSW_SECRET,
        resave: false,
        saveUninitialized: false,
        store: store,
    })
)

//check if user is auth
const isAuth = (req,res,next) => {
    if(req.session.isAuth){
        next()
    } 
    else {
        res.status(401).send()
    } 
}

app.post("/sign-up", async(req,res)=>{
    console.log("SIGN_UP [POST]")
    email = req.body.email
    psw = req.body.psw

    let user = await userModel.findOne({email})

    //controllo se esiste un user con la stessa email
    if(user){
        return res.status(403).send()
    } 
    
    //creo il nuovo user e lo salvo nel db
    user = new userModel({
        email,
        password : psw, //need to be hashed
    });

    await user.save()
    console.log("USER SALVATO")
    
    //sending email confirmation
    amqp.connect('amqp://guest:guest@rabbitmq:5672', function(err, connection) {
        if (err) {
            throw err;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
            throw error1;
            }
            var queue = 'mail_queue1';
            var msg = email

            channel.assertQueue(queue, {
                durable: true
            });
            channel.sendToQueue(queue, Buffer.from(msg), {
                persistent: true
            });
            console.log("Sent '%s'", msg);
        });
    });
    //res.send("message_sent")
    res.status(201).send()
})

app.post("/sign-in", async (req,res)=>{
    email = req.body.email
    psw = req.body.psw

    let user = await userModel.findOne({email})

    if(!user){
        return res.status(400).send()
    }

    const pswIsCorrect = user.password == psw;

    if(!pswIsCorrect){
        return res.status(401).send()
    }

    req.session.isAuth = true;


    //binda email e sessionid
    axios
        .post(couch_url, {
            user: email,
            sid: req.sessionID
        })
        .then(response => {
            console.log(`statusCode: ${response.status}`);

        })
        .catch(error => {
            console.error(error);
        });

    res.status(201).send()
    
})

couch_url =  "http://admin:admin@couchdb:5984/users_session"

app.get("/logout",(req,res)=>{
    ssid = req.sessionID.toString()
    req.session.destroy((err)=>{
        if(err) {
            throw err;
        }
        //remove session from couchdb
        axios
            .post(couch_url + "/_find",{
                selector:{
                    sid: ssid
                }
            })
            .then(response => {
                console.log(`statusCode: ${response.status}`);
                doc_id = response.data.docs[0]._id
                rev = response.data.docs[0]._rev
                delete_url = couch_url + "/" + doc_id + "/?rev=" + rev
                //-----
                axios
                    .delete(delete_url)
                    .then(res2 => {
                        console.log(`statusCode: ${response.status}`);
                    })
                    .catch(error => {
                        console.error(error);
                    }); 
                //------
            })
            .catch(error => {
                console.error(error);
                return res.send(error)
            });
        res.redirect("/static/index.html");
    });
})

//-----------gestione dati utente-----------//

couch_url_data =  "http://admin:admin@couchdb:5984/users_data"

app.post("/user/datas",(req,res)=>{
    if(req.session.isAuth){
        ssid = req.sessionID.toString()
        //-----
        axios
            .post(couch_url + "/_find",{
                selector:{
                    sid: ssid
                }
            })
            .then(response => {
                console.log(`statusCode: ${response.status}`);
                user_mail = response.data.docs[0].user
                //-----
                axios
                    .post(couch_url_data,{
                        user: user_mail, 
                        nameasset: req.body.nameasset,
                        quantity: req.body.quantity,
                        price: req.body.price,
                        date: req.body.date, 
                    })
                    .then(response2 => {
                        console.log(`statusCode: ${response2.status}`);
                    })
                    .catch(error2 => {
                        console.error(error2);
                        return res.send(error2)
                    });
                //------
            })
            .catch(error => {
                console.error(error);
                return res.send(error)
            });
        //-----
       
        res.status(201).send("ok")

    }
    else{
        //send error
        res.status(430).send()
    }
})

app.get("/user/datas", (req,res)=>{
    if(req.session.isAuth){
        ssid = req.sessionID.toString()
        //---
        axios
            .post(couch_url + "/_find",{
                selector:{
                    sid: ssid
                }
            })
            .then(response => {
                console.log(`statusCode: ${response.status}`);
                len_doc = response.data.docs.length
                if(len_doc) user_mail = response.data.docs[0].user;
                else return res.status(401).send()
                console.log("usermail : " + user_mail)
                //-----
                axios
                    .post(couch_url_data + "/_find",{
                        selector:{
                            user: user_mail
                        }
                    })
                    .then(response => {
                        console.log(`statusCode: ${response.status}`);
                        res.send(JSON.stringify(response.data.docs))
                    })
                    .catch(error => {
                        console.error(error);
                        return res.send(error)
                    });
                //------
            })
            .catch(error => {
                console.error(error);
                return res.send(error)
            });
        //---
    }
    else{
        res.status(430).send()
    }
})

app.get("/user/delete",(req,res)=>{
    trgt = req.query.coin
    //remove session from couchdb

    //-------------
    ssid = req.sessionID.toString()
    axios
        .post(couch_url + "/_find",{
            selector:{
                sid: ssid
            }
        })
        .then(response => {
            console.log(`statusCode: ${response.status}`);
            len_doc = response.data.docs.length
            if(len_doc) user_mail = response.data.docs[0].user;
            else return res.status(401).send()
            //=====
            axios
                .post(couch_url_data + "/_find",{
                    selector:{
                        user:user_mail,
                        nameasset:trgt,
                    }
                })
                .then(response2 => {
                    console.log(`statusCode: ${response2.status}`);
                    docs_ = response2.data.docs
                    //_______
                    promises = []
                    for(const i in docs_){
                        doc_id = docs_[i]._id
                        rev = docs_[i]._rev
                        delete_url = couch_url_data + "/" + doc_id + "/?rev=" + rev
                        promises.push(axios.delete(delete_url))
                    }
                    Promise.all(promises)
                        .then(res2 => {
                            console.log(`statusCode: ${res2.status}`);
                            res.status(201).send()
                        })
                        .catch(error => {
                            console.error(error);
                        });
                    //_________
                    
                })
                .catch(error => {
                    console.error(error);
                    return res.send(error)
                });
            //=======
        })
        .catch(error => {
            console.error(error);
            return res.send(error)
        });
})

//------------------------------------------//


//-----------------oAUTH--------------------//

client_id = process.env.CLIENT_ID
client_secret = process.env.CLIENT_SECRET
console.log(client_id)
red_uri= 'https://localhost:8083/oauth/getToken';
acc_token = ''

//first step
app.get("/oauth/init", (req,res)=>{
    res.redirect("https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/calendar&response_type=code&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri="+red_uri+"&client_id="+client_id);
});

//second step
app.get('/oauth/getToken', function(req, res){
    console.log("code taken");
  
    var formData = {
      code: req.query.code,
      client_id: client_id,
      client_secret: client_secret,
      redirect_uri: red_uri,
      grant_type: 'authorization_code'
    }
    
    axios
        .post('https://www.googleapis.com/oauth2/v4/token',formData)
        .then(response =>{
            acc_token = response.data.access_token
            console.log(response)
            console.log("access token: " + acc_token)
            res.redirect('https://localhost:8083/static/calendar/index.html?authorized=true')
        })
        .catch(err => {
            console.log(err) 
        })
});

app.get('/oauth/get_calendars', function(req, res){
    console.log('access_token:' + acc_token)

    const config = {
        headers:{
            'Authorization': 'Bearer '+ acc_token
        }
    }

    axios
        .get('https://www.googleapis.com/calendar/v3/users/me/calendarList',config)
        .then(response =>{
            console.log(response.data)
            calendars = response.data.items
            i_mcw = 0
            for (var i in calendars){
                if(calendars[i].summary == "MCW"){
                    i_mcw = i
                }
            }
            cal_id =  calendars[i_mcw].id
            //-------------
            axios
                .get('https://www.googleapis.com/calendar/v3/calendars/' + cal_id + '/events',config)
                .then(response2 =>{
                    console.log(response2.data)
                    res.send(response2.data)
                })
                .catch(error2 =>{
                    console.log(error2)
                })
            //-------------
        })
        .catch(error=>{
            console.log(error)
        })

    //----------------
  });

//------------------------------------------//

app.get("/isAuth", isAuth, (req,res)=>{
    res.status(200).send("OK")
})

app.get("/", (req,res)=>{
    if(req.session.isAuth){
        res.redirect('/static/dashboard/index.html')
    } else {
        res.redirect('/static/index.html')
    }
})

 
app.listen(3000,console.log("APP server listening on port 3000..."))
