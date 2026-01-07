const express = require("express");
require('dotenv').config()
require("./config/mongoose.connection")
const app = express();
const adminRoutes = require('./routes/adminRoutes')
const teacherRoutes = require('./routes/teacherRoutes')
const studentRoutes = require('./routes/studentRoutes')
const taskRoutes = require('./routes/taskRoutes')
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const PORT = process.env.PORT || 3004

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/admin',adminRoutes,taskRoutes)
app.use('/teacher',teacherRoutes,taskRoutes)



app.listen(PORT, function () {
  console.log(`Server is running on PORT: ${PORT}`)
});
