let app = Vue.createApp({
    data(){
        return {
            email:"",
            psw:"",
            emailreg:"",
            pswreg:"",
        }
    },
    methods: {
        register_submit(){

            var url = "http://localhost:8080/sign-up";
            $.ajax({
                type: 'POST',
                url: url,
                data: { 
                    email: this.emailreg, 
                    psw : this.pswreg // <-- the $ sign in the parameter name seems unusual, I would avoid it
                },
                success: function(msg){
                    window.location.replace("http://localhost:8080/static/index.html")
                },
                error: function(){
                    alert("user already exist")
                }
            });


        },
        login_submit(){
            dataa = { 
                email:this.email,
                psw:this.psw
            }
            var url = "http://localhost:8080/sign-in";
            $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify(dataa),
                contentType: "application/json",
                statusCode:{
                    201: function(res){
                        window.location.replace("http://localhost:8080/static/dashboard/index.html")
                    },
                    401: function(res){
                        alert("wrong password")
                    },
                    400: function(res){
                        alert("no acoount registered with this email")
                    }
                }
            });


        }
    }
});
app.mount('#HvueAppAuth')

