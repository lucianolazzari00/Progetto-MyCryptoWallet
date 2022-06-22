let app = Vue.createApp({
    data(){
        return {
            sumField: "",
            interestField: "",
            timeField: "1",
            result: 0.00,
            total_market_cap: 0,
            btc_dominance : 0,
            total_volume_24h: 0,
        }
    },
    methods: {
        check_if_isAuth(){
            return new Promise((resolve,reject)=>{
                axios.get("https://localhost:8083/isAuth")
                .then(res =>{
                    console.log("client authenticated")
                    $('#main_cont').css('display','block')
                    resolve()
                })
                .catch(error=>{
                    console.log(error)
                    if(error.response.status==401){
                        console.log("client is NOT auth... redirecting ")
                        window.location.replace("/static/index.html")
                    }
                    reject(e)
                })
            })
        },
        f_global_data(){
            axios
                .get("https://localhost:8083/api/stats")
                .then(res3 => {
                    var info2 = res3.data
                    
                    var tmc = info2.total_market_cap
                    var btcd = info2.btc_dominance
                    var tv = info2.total_volume_24h

                    this.total_market_cap = tmc.toFixed(2)
                    this.btc_dominance = btcd.toFixed(2)
                    this.total_volume_24h = tv.toFixed(2)
              })
                .catch(error => {
                    console.error(error)
              })
        },
        time_radio_updater(event){
            this.timeField=event.target.value
        },
        calculator(){
            this.result = (((this.sumField*(this.interestField/100))/365)*parseInt(this.timeField)).toFixed(2)
        },
        reset_result(){
            this.result = 0.00;
        },
    },
    created(){
        this.check_if_isAuth()
            .then(this.f_global_data())
            .catch((e)=>{console.log(e)})
        
    }
});
app.mount('#vueAppApyCalc')

