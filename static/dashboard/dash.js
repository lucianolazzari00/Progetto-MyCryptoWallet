
let app = Vue.createApp({
    data(){
        return {
            username : "",
            nameasset:"",
            quantity:"",
            price:"",
            date:"",
            assets: [],
            total_value : 0,
            total_invested : 0,
            total_p_l : 0,
            total_p_l_percent : 0,
            p_l_24h : 0,
            p_l_24h_val : 0,
            best_performer : "",
            profit_bf : 0,
            worst_performer : "",
            profit_wf : 0,
            total_market_cap: 0,
            btc_dominance : 0,
            total_volume_24h: 0,
            pie_chart : null,
            line_chart: null,
            historical_balance : [0,0,0,0,0,0,0],
            var_balance_24h : 0
    }
    },
    methods: {
        f_historical_data(){
            historical_balance = [0,0,0,0,0,0,0]
            ass = this.assets
            for(const i in this.assets){
                name_c = ass[i].name
                axios.get("http://localhost:8080/api/historical_price?coin=" + name_c)
                    .then(res3 => {
                        info = res3.data
                        for(let j=0;j<7;j++){
                            //cerco l'holding
                            hold = 0
                            target = info.coin
                            for(const a in ass){
                                if(ass[a].name == target) hold = ass[a].holdings;
                            }
                            //
                            this.historical_balance[j] += info.price[j] * hold
                        }
                        this.line_chart_update()
                        this.var_balance_24h = ((this.historical_balance[6]-this.historical_balance[5])/this.historical_balance[5]).toFixed(2)
                        
                        if(this.var_balance_24h >= 0){
                            $("#p_l_24hperc").css('color','greenyellow')
                        } else {
                            $("#p_l_24hperc").css('color','red')
                        }
                    })
                    .catch(error => {
                        console.error(error)
                    })
            }
        },


        f_global_data(){
            return new Promise((resolve,reject)=>{
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
                        resolve(info2)
                    })
                    .catch(error => {
                        console.error(error)
                    })
            })
            
        },


        fetch_user_datas(){
            return new Promise((resolve,reject)=>{
                this.assets = []
                axios.get('http://localhost:8080/user/datas')
                    .then(response => {

                        datas = response.data
                        if(datas.length == 0){
                            resolve(this.assets)
                            return
                        }
                        this.username = datas[0].user
                        var len = datas.length
                        
                        for(var i=0;i<len;i++){
                            ass_name = datas[i].nameasset
                            flag = false
                            for(var el in this.assets){
                                let element = this.assets[el]
                                if (element.name == ass_name){
                                    flag = true
                                    this.assets[el].holdings += parseFloat(datas[i].quantity)
                                    this.assets[el].total_spent += parseFloat(datas[i].quantity * datas[i].price) 
                                    this.assets[el].med_load = parseFloat(parseFloat(this.assets[el].total_spent) / parseFloat(this.assets[el].holdings) ).toFixed(2) 
                                }
                            }
                            if(flag == false){
                                const new_obj = {
                                    name : datas[i].nameasset,
                                    holdings : parseFloat(datas[i].quantity),
                                    total_spent: parseFloat(datas[i].quantity * datas[i].price),
                                    med_load: parseFloat(datas[i].price),
                                }
                                this.assets.push(new_obj)
                            }
                            
                        }   
                        resolve(this.assets)       
                    })
                    .catch(e => {
                        console.log(e)
                        if(e.response.status == 430){
                            window.location.replace("/static/index.html")
                        }
                        reject(e)
                    })
            });
        },


        fetch_coin_price(){
            n_assets = this.assets.length
            promises = []
            for(var j=0;j<n_assets;j++){
                var coin = this.assets[j].name
                promises.push(axios.get('http://localhost:8080/api/price?coin='+coin))
            }
            Promise.all(promises)
                .then(values => {

                    for (const v in values){
                        response2 = values[v]
                    
                        coin_price = response2.data.prezzo.toFixed(2)
                        name_to_update = response2.data.name
                        perc24h = response2.data.percent_24h.toFixed(2)

                        for (const item in this.assets){
                            if (this.assets[item].name == name_to_update){
                                this.assets[item].price = coin_price
                                this.assets[item].perc24h = perc24h
                                this.assets[item].total_asset_value = (parseFloat(this.assets[item].price) * parseFloat(this.assets[item].holdings))
                                this.assets[item].p_l = (this.assets[item].total_asset_value - this.assets[item].total_spent).toFixed(2) 
                            }
                        }
                    }
                    this.compute_total_values()
                    this.pie_chart_update()
                    
                    })
                .catch(e2 =>{
                    console.log(e2)
                })
        },


        compute_total_values(){
            this.total_value = 0
            this.total_invested = 0
            this.total_p_l = 0
            this.p_l_24h = 0
            ass = this.assets
            
            ass_len = this.assets.length
            for(var i=0;i<ass_len;i++){
                this.total_value += parseFloat(ass[i].total_asset_value)
                this.total_invested += parseFloat(ass[i].total_spent)
            }
            this.best_performer = "";
            max_p = -999999999
            this.worst_performer = "";
            min_p = 999999999
            ass_len = this.assets.length
            for(var i=0;i<ass_len;i++){
                if(parseFloat(ass[i].p_l) >= max_p){
                    max_p = parseFloat(ass[i].p_l)
                    this.best_performer = ass[i].name
                }
                this.profit_bf = (max_p/100).toFixed(2)

                if(parseFloat(ass[i].p_l) <= min_p){
                    min_p = parseFloat(ass[i].p_l)
                    this.worst_performer = ass[i].name
                }
                this.profit_wf = (min_p/100).toFixed(2)

                var weight = (ass[i].total_asset_value)/this.total_value
                this.p_l_24h += ass[i].perc24h * weight
            }

            this.p_l_24h = this.p_l_24h.toFixed(2)
            this.p_l_24h_val = (this.total_value - (this.total_value - (this.p_l_24h*100))).toFixed(2)
            this.total_p_l = (this.total_value-this.total_invested).toFixed(2)
            this.total_value = (this.total_value).toFixed(2) 
            this.total_invested = (this.total_invested).toFixed(2) 
            this.total_p_l_percent = ((this.total_p_l/this.total_invested)*100).toFixed(2)

            if(this.total_p_l_percent >= 0){
                $("#perc").css('color','greenyellow')
            } else {
                $("#perc").css('color','red')
            }

            
            if(this.profit_bf >= 0){
                $("#p_bf").css('color','greenyellow')
            } else {
                $("#p_bf").css('color','red')
            }

            if(this.profit_wf >= 0){
                $("#p_wf").css('color','greenyellow')
            } else {
                $("#p_wf").css('color','red')
            }

    
        },


        submit_new_asset(){
            //controllo form
            fname = $("#name").val()
            fquantity = $("#quantity").val()
            fppc = $("#ppc").val()
            fdate = $("#data").val()

            var alert_msg = ""

            if(fname == null){
                alert_msg += "selezionare un asset\n"
                $("#name").css("border-color","red")
                $("#name").css("border-width","2px")
            }

            if(fquantity==null){
                alert_msg += "inserire una quantità\n"
                $("#quantity").css("border-color","red")
                $("#quantity").css("border-width","2px")
            }
            if(fquantity!=null){
                if(isNaN(fquantity)){
                    alert_msg += "la quantita deve essere un numero\n"
                    $("#quantity").css("border-color","red")
                    $("#quantity").css("border-width","2px")
                }
                else if(fquantity<=0){
                    alert_msg += "inserire una quantita maggiore di zero\n"
                    $("#quantity").css("border-color","red")
                    $("#quantity").css("border-width","2px")
                }
            }

            if(fppc==null){
                alert_msg += "inserire un prezzo\n"
                $("#ppc").css("border-color","red")
                $("#ppc").css("border-width","2px")
            }
            if(fppc!=null){
                if(isNaN(fppc)){
                    alert_msg += "il prezzo deve essere un numero\n"
                    $("#ppc").css("border-color","red")
                    $("#ppc").css("border-width","2px")
                }
                else if(fppc<=0){
                    alert_msg += "inserire un prezzo maggiore di zero\n"
                    $("#ppc").css("border-color","red")
                    $("#ppc").css("border-width","2px")
                }
            }
            var date = new Date()
            var gg = date.getDate()
            var mm = date.getMonth() + 1
            var aa = date.getFullYear()
            user_input_date = fdate.split("-") //anno - mese -giorno

            if(fdate == ""){
                alert_msg += "inserire una data\n"
                $("#data").css("border-color","red")
                $("#data").css("border-width","2px")
            }
            else{
                if(user_input_date[0]>aa){
                    alert_msg += "inserire data corrente o passata"
                    $("#data").css("border-color","red")
                    $("#data").css("border-width","2px")
                }
                else if(user_input_date[0]==aa){
                    if(user_input_date[1]>mm){
                        alert_msg += "inserire data corrente o passata"
                        $("#data").css("border-color","red")
                        $("#data").css("border-width","2px")
                    }
                    else if(user_input_date[1]==mm){
                        if(user_input_date[2]>gg){
                            alert_msg += "inserire data corrente o passata"
                            $("#data").css("border-color","red")
                            $("#data").css("border-width","2px")
                        }
                    }
                }
    
            }


            //alert
            if (alert_msg!=""){
                alert(alert_msg)
                return
            }

            //reset css changes
            $("#name").css("border-color","")            
            $("#quantity").css("border-color","")
            $("#ppc").css("border-color","")
            $("#data").css("border-color","")

            $("#name").css("border-width","")            
            $("#quantity").css("border-width","")
            $("#ppc").css("border-width","")
            $("#data").css("border-width","")

            //----
            
            ftc = this.fetch_user_datas
            ftc2 = this.fetch_coin_price

            dataa = { 
                nameasset: this.nameasset, 
                quantity: this.quantity,
                price: this.price,
                date: this.date, 
            };
            var url = "http://localhost:8080/user/datas";
            $.ajax({
                type: 'POST',
                url: url,
                contentType: "application/json",
                data: JSON.stringify(dataa),
                success: function(msg){
                    ftc()
                        .then((ret)=>ftc2())
                },
                error: function(){
                    alert("some error")
                }
            });
            $("#Modal").modal("hide")
        },

        remove_asset(name,event){
            target_to_del = name

                ftc = this.fetch_user_datas
                ftc2 = this.fetch_coin_price
    
                var url ="http://localhost:8080/user/delete?coin="+ target_to_del;
                $.ajax({
                    type: 'GET',
                    url: url,
                    success: function(msg){
                        console.log("SUCCESS DIOCANE")
                        ftc()
                            .then((ret)=>ftc2())
                    },
                    error: function(){
                        console.log("ERRORE DIOCANE")
                    }
                });
        },


        pie_chart_update(){
            
            let mylabels = []
            let mydata = []
            let ass = this.assets
            for(const i in this.assets){
                mylabels.push(ass[i].name)
                mydata.push(ass[i].total_asset_value)
            }

            this.pie_chart.data.labels = mylabels
            this.pie_chart.data.datasets[0].data = mydata

            this.pie_chart.update()
        },


        initialize_pie_chart(){
            let piechart = document.getElementById("pie-chart").getContext('2d')
            
            let mylabels = []
            let mydata = []

            let chart = new Chart(piechart,{
                type : 'doughnut',
                data : {
                    labels: mylabels,
                    datasets:[{
                        label: "asset allocation",
                        data: mydata,
                        backgroundColor: ['#ffa600','#ff7c43','#f95d6a','#d45087','#a05195','#665191','#2f4b7c','#003f5c','#6c91e9','#0095d9'],
                        borderWidth: 0,	
                    }],
                },
                options: {
                    legend: {
                        display: true,
                        position: 'left',
                        labels: {
                            fontColor: 'rgb(255,255,255)'
                        }
                    },
                    layout:{
                        padding : 15
                    },
                    responsive: true,
                    maintainAspectRatio : false,
                },
        })

        this.pie_chart = chart
        }, 


        initialize_line_chart(){
            let linechart = document.getElementById("line-chart").getContext('2d')
            
            let mylabels = ["-6","-5","-4","-3","-2","-1","Today"]
            let mydata = []

            let chart = new Chart(linechart,{
                type : 'line',
                data : {
                    labels: mylabels,
                    datasets:[{
                        borderWidth: 4,
                        borderColor: "#1ea896",
                        fill:false,
                        label: "Balance",
                        data: mydata,
                        pointHoverRadius: 12,
                    }],
                },
                options: {
                    legend: {
                        display: false,
                        position: 'right',
                    },
                    layout:{
                        padding : {
                            bottom: 50,
                            left: 0,
                            right: 10,
                            top: 10
                        },
                    },
                    responsive : true,
                    maintainAspectRatio : false,
                },
        })
            this.line_chart = chart
        },


        line_chart_update(){
            let mydata = this.historical_balance
            this.line_chart.data.datasets[0].data = mydata

            this.line_chart.update()
        },

        chart_re_render(){
            console.log("renderinmg")
            this.line_chart.destroy()
            setTimeout(() => this.initialize_line_chart(), 50)
            setTimeout(() => this.line_chart_update(), 80)
        },

        toggle_sidebar(){
            $('#sidebar').toggleClass('active');
            if ($('.sb-act').css('display')=='none'){
                $('.sb-act').css('display','block');
            }
            else if ($('.sb-act').css('display')=='block'){
                $('.sb-act').css('display','none');
            };
            if ($('.sb-nact').css('display')=='block'){
                $('.sb-nact').css('display','none');
            }
            else if ($('.sb-nact').css('display')=='none'){
                $('.sb-nact').css('display','block');
            };
            setTimeout(() => this.chart_re_render(), 50)
        }
    },



    mounted(){
        this.f_global_data()
            .then((ret)=>{
                this.initialize_line_chart()
                this.initialize_pie_chart()
            })  
        this.fetch_user_datas()
            .then((ret) => {
                this.f_historical_data()
                this.fetch_coin_price()
            })         
    }
});
app.mount('#vueApp')


