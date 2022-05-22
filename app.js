let app = Vue.createApp({
    data(){
        return {
            assets:[
                {
                    name:"Ethereum",
                    price: 2340,
                    holdings: 32,
                    medium_load: 2500,
                    p_l: +0.35,
                },
                {
                    name:"Bitcoin",
                    price: 29475,
                    holdings: 21,
                    medium_load: 30000,
                    p_l: +0.75,
                },
                {
                    name:"Binance coin",
                    price: 345,
                    holdings: 3785,
                    medium_load: 450,
                    p_l: +0.89,
                },
                {
                    name:"convex",
                    price: 14.74,
                    holdings: 569,
                    medium_load: 10.54,
                    p_l: +1.45,
                },
                {
                    name:"shiba inu",
                    price: 0.0076,
                    holdings:1090,
                    medium_load:0.45,
                    p_l:1.56
                }
        ],
        }
    },
    methods: {
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

function form_handler(){
    alert("devo fa l'handler")
}
