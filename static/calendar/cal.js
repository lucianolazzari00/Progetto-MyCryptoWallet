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
                    if(error.response.status==430){
                        window.location.replace("/static/index.html")
                    }
                    console.error(error)
              })
        },
        get_calendar_data(){
            axios
                .get('http://localhost:8080/oauth/get_calendars')
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
            window.location.replace('http://localhost:8080/oauth/init')
        }
    },
    created(){
        this.f_global_data()
        let urlParams = new URLSearchParams(window.location.search);
        url_param = urlParams.get('authorized');
        if(url_param=='true'){
            this.get_calendar_data()
        }
    }
});
app.mount('#vueAppCalendar')

