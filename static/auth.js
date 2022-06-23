let app = Vue.createApp({
    data(){
        return {
            email:"",
            psw:"",
            emailreg:"",
            pswreg:"",
            repswreg:"",
        }
    },
    methods: {
        display_landing(){
            $('#signInBtn').css('display','inline');
            $('#subtitle').css('display','block');
            $('#signUpBtn').css('display','inline');
            $('#signInCard').css('display','none');
            $('#signUpCard').css('display','none');
        },
        display_signin(){
            $('#signInBtn').css('display','none');
            $('#subtitle').css('display','none');
            $('#signUpBtn').css('display','none');
            $('#signInCard').css('display','block');
            $('#signUpCard').css('display','none');
        },
        display_signup(){
            $('#signInBtn').css('display','none');
            $('#subtitle').css('display','none');
            $('#signUpBtn').css('display','none');
            $('#signInCard').css('display','none');
            $('#signUpCard').css('display','block');
        },
        register_submit(){
            alert_msg = ""
            var validRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if(this.emailreg==""){
                alert_msg += "\ninserire una email"
                $("#RegInputEmail1").css("border-color","red")
            } else if (!this.emailreg.match(validRegex)) {
                alert_msg += "\ninserire una email valida"
                $("#RegInputEmail1").css("border-color","red")
            }
            if(this.pswreg == ""){
                alert_msg += "\ninserire una password"
                $("#RegInputPassword1").css("border-color","red")
            }
            if(this.repswreg == ""){
                alert_msg += "\nreinserire la password"
                $("#RepeatInputPassword1").css("border-color","red")
            }
            if (this.pswreg != this.repswreg) {
                alert_msg += "\ninserire la stessa password"
                $("#RegInputPassword1").css("border-color","red")
                $("#RepeatInputPassword1").css("border-color","red")
            }

            
            
            if(alert_msg!=""){
                alert(alert_msg)
                return
            }

            $("#RegInputEmail1").css("border-color","")
            $("#RegInputPassword1").css("border-color","")
            $("#RepeatInputPassword1").css("border-color","")

            that = this
            
            var url = "https://localhost:8083/sign-up";
            data = { 
                email: this.emailreg, 
                psw : this.pswreg 
            };
            axios
                .post(url,data)
                .then(res => {
                    that.display_signin()
                })
                .catch(error => {
                    console.log(error)
                    console.log(error.response.status);
                    if (error.response.status==403)alert("user already exist");
                })
 

        },
        login_submit(){
            //controllo form
            console.log(this.email)
            alert_msg = ""
            var validRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if(this.email==""){
                alert_msg += "\ninserire una email"
                $("#InputEmail1").css("border-color","red")
            } else if (!this.email.match(validRegex)) {
                alert_msg += "\ninserire una email valida"
                $("#InputEmail1").css("border-color","red")
            }
            console.log(this.psw)
            if(this.psw == ""){
                alert_msg += "\ninserisci una password"
                $("#InputPassword1").css("border-color","red")
            }

            if(alert_msg!=""){
                alert(alert_msg)
                return
            }
            //--------

            dataa = { 
                email:this.email,
                psw:this.psw
            }
            var url = "https://localhost:8083/sign-in";
            $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify(dataa),
                contentType: "application/json",
                statusCode:{
                    201: function(res){
                        window.location.replace("https://localhost:8083/static/dashboard/index.html")
                    },
                    401: function(res){
                        alert("wrong password")
                        $("#InputPassword1").css("border-color","red")
                    },
                    400: function(res){
                        alert("no account registered with this email")
                        $("#InputEmail1").css("border-color","red")
                    }
                }
            });


        },
    }
});
app.mount('#HvueAppAuth')

