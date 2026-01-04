const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const path = require('path')


const app = express()


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.get('/',function (req,res) {
   console.log('working');
   
    res.send('hello jii')
})

app.listen(3000,function () {
    console.log('connected');
    
})