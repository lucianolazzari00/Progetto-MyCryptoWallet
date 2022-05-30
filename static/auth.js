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
            if(this.emailreg==null){
                alert_msg += "inserire una email"
                $("#RegInputEmail1").css("border-color","red")
            } else if (!this.emailreg.match(validRegex)) {
                alert_msg += "inserire una email valida"
                $("#RegInputEmail1").css("border-color","red")
            }
            if (this.pswreg != this.repswreg) {
                alert_msg += "inserire la stessa password"
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
            
            var url = "http://localhost:8080/sign-up";
            $.ajax({
                type: 'POST',
                url: url,
                data: { 
                    email: this.emailreg, 
                    psw : this.pswreg 
                },
                success: function(msg){
                    that.display_signin()
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
                        $("#InputPassword1").css("border-color","red")
                    },
                    400: function(res){
                        alert("no acoount registered with this email")
                        $("#InputEmail1").css("border-color","red")
                    }
                }
            });


        },
    }
});
app.mount('#HvueAppAuth')

