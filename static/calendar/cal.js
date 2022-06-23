let app = Vue.createApp({
    data(){
        return {
            events: [],
            server_response : "bella",
            url_param : "",
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
                    console.error(error)
              })
        },
        get_calendar_data(){
            axios
                .get('https://localhost:8083/oauth/get_calendars')
                .then(response =>{
                    console.log(response.data)
                    ev_list = response.data.items
                    console.log(ev_list)
                    for(ev in ev_list){
                        ev_name = ev_list[ev].summary
                        dateTime = ev_list[ev].start.dateTime
                        arr = dateTime.split("T")
                        new_ev = {
                            name: ev_name,
                            date: arr[0],
                            time: arr[1].split("+")[0]
                        }
                        this.events.push(new_ev)
                    }

                })
        },
        oauth_init(){
            if(url_param=='true') return;
            window.location.replace('https://localhost:8083/oauth/init')
        }
    },
    created(){
        this.check_if_isAuth()
            .then(()=>{
                this.f_global_data()
                let urlParams = new URLSearchParams(window.location.search);
                url_param = urlParams.get('authorized');
                if(url_param=='true'){
                    this.get_calendar_data()
                }
            })
        
    }
});
app.mount('#vueAppCalendar')

