let app = Vue.createApp({
    data(){
        return {
            sumField: "",
            interestField: "",
            timeField: "1",
            compField: "1",
            result: 0.00,
            total_market_cap: 0,
            btc_dominance : 0,
            total_volume_24h: 0,
        }
    },
    methods: {
        f_global_data(){
            axios
              .get("http://localhost:8080/api/stats")
              .then(res3 => {
                
                var info2 = res3.data
                
                var tmc = info2.total_market_cap
                var btcd = info2.btc_dominance
                var tv = info2.total_volume_24h

                this.total_market_cap = tmc.toFixed(2)
                this.btc_dominance = btcd.toFixed(2)
                this.total_volume_24h = tv.toFixed(2)
                $('#main_cont').css('display','block')
              })
              .catch(error => {
                  window.location.replace("/static/index.html")
                  console.error(error)
              })
        },
        time_radio_updater(event){
            this.timeField=event.target.value
        },
        comp_radio_updater(event){
            this.compField=event.target.value
        },
        calculator(){
            this.result = (((this.sumField*(this.interestField/100))/365)*parseInt(this.timeField)).toFixed(2)
            //this.result = Math.pow(this.sumField*(1 + this.interestField/100),(this.timeField).toFixed(2));
        },
        reset_result(){
            this.result = 0.00;
        },
    },
    created(){
        this.f_global_data()
    }
});
app.mount('#vueAppApyCalc')

