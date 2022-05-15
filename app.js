let app = Vue.createApp({
    data(){
        return {
            assets:[
                {
                    crypto:"Ethereum",
                    holdings: 32,
                    med_load: 2500,
                    p_l: 0.35,
                },
                {
                    crypto:"Bitcoin",
                    holdings: 21,
                    med_load: 30000,
                    p_l: 0.75,
                },
                {
                    crypto:"Binance coin",
                    holdings: 3785,
                    med_load: 450,
                    p_l: 0.89,
                },
                {
                    crypto:"convex",
                    holdings: 569,
                    med_load: 10.54,
                    p_l: 1.45,
                },
                {
                    crypto:"shiba inu",
                    holdings:1090,
                    med_load:0.45,
                    p_l:1.56
                }
        ],
        portfolios: [
            {
                name: "big capitalization"
            },
            {
                name: "nft-metaverse"
            },
            {
                name: "defi"
            },
            {
                name: "gambling"
            }
        ]
        }
    },
    methods: {
        pie_show(){
            var pie = document.getElementById("pie-chart")
            var line = document.getElementById("line-chart")
            line.style.display = "none"
            pie.style.display = "block"
            pie.style.alignContent = "center"
        },
        line_show(){
            var pie = document.getElementById("pie-chart")
            var line = document.getElementById("line-chart")
            line.style.display = "block"
            pie.style.display = "none"
        }
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
