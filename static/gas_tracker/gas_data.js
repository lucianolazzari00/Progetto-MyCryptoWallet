
let app = Vue.createApp({
    data(){
        return {
            slow:"",
            standard: "",
            fast:"",
            slow_eur : 0,
            std_eur : 0,
            fast_eur : 0,
            time:10,
            total_market_cap: 0,
            btc_dominance : 0,
            total_volume_24h: 0,
            eth_price : 0,
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
                    reject(error)
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
                  console.log("ERROREE")
                  console.error(error)
              })
        },
        fetch_gas_data(){
            axios 
            .get("https://localhost:8083/api/gas")
            .then(res2 => {
            
            var info = res2.data
            
            var low = info.low
            var average = info.average
            var high = info.high

            this.slow = info.low
            this.standard = info.average
            this.fast = info.high

            //--
            axios.get('https://localhost:8083/api/price?coin=ethereum')
                .then(response2 => {
                    coin_price = response2.data.prezzo.toFixed(2)
                    this.slow_eur = (parseFloat(this.slow) * 0.000000001 * coin_price *21000).toFixed(2)
                    this.std_eur = (parseFloat(this.standard) * 0.000000001 * coin_price *21000).toFixed(2)
                    this.fast_eur = (parseFloat(this.fast) * 0.000000001 * coin_price *21000).toFixed(2)
                    })
                .catch(e2 =>{
                    console.log(e2)
                })
            //--
            })
            .catch(error => {
                console.error(error)
            })

            this.time = 10
        },
        timer_function(){
            this.time -= 1;
        }
    },

    created(){
        this.check_if_isAuth()
            .then(()=>{
                this.fetch_gas_data()
                this.f_global_data()
                this.interval2 = setInterval(()=> this.timer_function(), 1000)
                this.interval = setInterval(()=> this.fetch_gas_data(), 10000)
            })
        
    }
});
app.mount('#vueAppGas')
