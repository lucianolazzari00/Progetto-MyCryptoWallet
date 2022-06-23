const express = require("express")
const axios = require("axios")
const app = express()

require("dotenv").config()
//console.log(process.env.COIN_API_KEY)

if(process.env.MODE=="test"){
    //disable logs if testing
    console.log = function(){};
    console.error = function(){};
    console.warn = function(){};
}




//------------------API---------------------//

app.get("/api/historical_price",(req,res) => {
    var slug = req.query.coin
    var coin = require("./coinapi.json")
    var coin_id = coin[slug]
    let date = new Date()
    let date_start = new Date();
    date_start.setDate(date.getDate() - 7)
    date_start = date_start.toISOString()
    date_end = date.toISOString();
    console.log(date_start)
    console.log(date_end)
    var url = "https://rest.coinapi.io/v1/exchangerate/"+coin_id+"/EUR/history?period_id=1DAY&time_start="+date_start+"&time_end="+date_end
    api_key =  process.env.COIN_API_KEY
    console.log(api_key)
    const config = {
        headers:{
           "X-CoinAPI-Key": api_key
        }
    }
    
    axios
        .get(url,config)
        .then(res2 => {
            var info = res2.data
            r = {
                coin : slug,
                price : [res2.data[0].rate_open, 
                    res2.data[1].rate_open, 
                    res2.data[2].rate_open, 
                    res2.data[3].rate_open, 
                    res2.data[4].rate_open,
                    res2.data[5].rate_open,
                    res2.data[6].rate_open,
                ]
            }
            res.status(200).send(r)
        })
        .catch(error => {
            res.status(400).send(error)
            console.error(error) 
        })
})

app.get("/api/price",(req,res) => {
    
    var slug = req.query.coin
    var options = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?convert=EUR&slug=" + slug + "&CMC_PRO_API_KEY=" + process.env.CMC_API_KEY
    
    var coin = require("./coin.json") 
    var id = coin[slug]
    
    axios
        .get(options)
        .then(res2 => {
            var info = res2.data
            var prezzo = info.data[id].quote.EUR.price
            var percent_24h = info.data[id].quote.EUR.percent_change_24h
            res.json({"prezzo" : prezzo, "name" : slug, "percent_24h" : percent_24h})
        })
        .catch(error => {
            console.error(error)
            res.status(400).send()
        })
})


app.get("/api/stats", (req,res) => {    
    var options = "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest?convert=EUR&CMC_PRO_API_KEY=" + process.env.CMC_API_KEY 

    axios
        .get(options)
        .then(res2 => {
            var info = res2.data
            var  total_market_cap = info.data.quote.EUR.total_market_cap
            var btc_dominance = info.data.btc_dominance
            var total_volume_24h = info.data.quote.EUR.total_volume_24h

            res.json({"total_market_cap" : total_market_cap, "btc_dominance" : btc_dominance, "total_volume_24h" : total_volume_24h})
        })
        .catch(error => {
            console.error(error)
            res.status(400).send()
        })
    
}) 

app.get("/api/gas", (req,res) => {

    var options = "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=" + process.env.ETH_SCAN_API_KEY

    axios
        .get(options)
        .then(res2 => {
            var info = res2.data
            var low = info.result.SafeGasPrice
            var average = info.result.ProposeGasPrice
            var high = info.result.FastGasPrice
            res.status(200)
            res.json({"low" : low, "average" : average, "high" : high})
        })
        .catch(error => {
            console.error(error)
            res.status(400).send()
        })
    
}) 

//------------------------------------------//

 
app.listen(3000,console.log("API server listening on port 3000..."))

module.exports = app //for testing