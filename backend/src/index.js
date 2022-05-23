const express = require("express")

app = express()

app.get("/login",(req,res)=>{
    res.send("ciao")
})

app.listen(3000,console.log("server listening on port 3000..."))