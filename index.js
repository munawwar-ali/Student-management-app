const express = require("express");
require('dotenv').config()
require("./config/mongoose.connection")
const app = express();
const adminRoutes = require('./routes/adminRoutes')
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const PORT = process.env.PORT || 3004

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/admin',adminRoutes)

app.listen(PORT, function () {
  console.log(`Server is running on PORT: ${PORT}`)
});
