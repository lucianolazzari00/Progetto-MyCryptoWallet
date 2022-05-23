let app = Vue.createApp({
    data(){
        return {
            email:"",
            psw:"",
        }
    },
    methods: {
        login_submit(){
            var url = "http://localhost:8081";
            $.ajax({
                type: 'POST',
                url: url,
                data: { 
                    email: this.email, 
                    psw : this.psw // <-- the $ sign in the parameter name seems unusual, I would avoid it
                },
                success: function(msg){
                    alert("hola")
                    alert(msg);
                }
            });


        }
    }
});
app.mount('#vueAppAuth')

