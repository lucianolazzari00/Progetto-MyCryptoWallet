
let app = Vue.createApp({
    data(){
        return {
            nameasset:"",
            quantity:"",
            price:"",
            date:"",
            assets: [],
            ciao: "",
        }
    },
    methods: {
        fetchdata(){
            this.assets = []
            console.log(this.assets)
            axios.get('http://localhost:8080/user/datas')
                .then(response => {
                    // JSON responses are automatically parsed.
                    datas = response.data
                    console.log(response.data)
                    var len = datas.length
                    //const ast = []
                    for(var i=0;i<len;i++){
                        ass_name = datas[i].nameasset
                        flag = false
                        for(var el in this.assets){
                            let element = this.assets[el]
                            if (element.name == ass_name){
                                flag = true
                                this.assets[el].holdings += parseFloat(datas[i].quantity)
                                this.assets[el].total_spent += parseFloat(datas[i].quantity * datas[i].price) 
                                this.assets[el].med_load = parseFloat(parseFloat(this.assets[el].total_spent) / this.assets[el].holdings).toFixed(2) 
                            }
                        }
                        if(flag == false){
                            const new_obj = {
                                name : datas[i].nameasset,
                                holdings : parseFloat(datas[i].quantity),
                                total_spent: parseFloat(datas[i].quantity * datas[i].price),
                                med_load: parseFloat(datas[i].price)
                            }
                            this.assets.push(new_obj)
                        }
                        //this.assets = JSON.parse(JSON.stringify(ast))
                        //this.assets = JSON.stringify(this.assets)
                    }
                    console.log(this.assets)
                    })
                .catch(e => {
                    console.log(e)
                    window.location.replace("/static/index.html")
                })
        },
        submit_new_asset(){
            tmp = this.fetchdata
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
                    console.log(msg)
                    tmp()
                },
                error: function(){
                    alert("some error")
                }
            });
        },
    },
    created(){
        this.fetchdata()
        
    }
});
app.mount('#vueApp')


new Morris.Donut({
    // ID of the element in which to draw the chart.
    element: 'pie-chart',
    // Chart data records -- each entry in this array corresponds to a point on
    // the chart.
    data: [
        { label: 'ETH', value: 50 },
        { label: 'CVX', value: 20 },
        { label: 'TOKE', value: 20 },
        { label: 'BTC', value: 5 },
        { label: 'BNB', value: 5 }
    ],
    colors:["#ab1b63","#e6cb1e","#4ace36","#0061e0","#6c08de","#2f3b4b","#303f4f","#d7dfe4"],
    labelColor: "#ffffff"
    });

Morris.Line({
    element: 'line-chart',
    data: [
        { y: '2006', a: 100,},
        { y: '2007', a: 75, },
        { y: '2008', a: 50, },
        { y: '2009', a: 75, },
        { y: '2010', a: 50, },
        { y: '2011', a: 75, },
        { y: '2012', a: 100,}
    ],
    xkey: 'y',
    ykeys: 'a',
    labels: 'Series A',
    lineColors: ["#04c097"],
    resize : true
});

