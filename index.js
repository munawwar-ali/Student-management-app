const express = require('express')
const app = express()

app.get('/',function (req,res) {
   console.log('working');
   
    res.send('hello jii')
})

app.listen(3000,function () {
    console.log('connected');
    
})