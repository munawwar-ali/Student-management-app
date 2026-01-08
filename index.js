const express = require("express");
require("dotenv").config();
require("./config/mongoose.connection");
const app = express();
const adminRoutes = require("./routes/adminRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const taskRoutes = require("./routes/taskRoutes");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cookieParser = require("cookie-parser");

app.use(cookieParser());

const PORT = process.env.PORT || 3004;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/admin", adminRoutes);
app.use("/teacher", teacherRoutes);
app.use("/student", studentRoutes);
app.use("/tasks", taskRoutes);

app.listen(PORT, function () {
  console.log(`Server is running on PORT: ${PORT}`);
});
