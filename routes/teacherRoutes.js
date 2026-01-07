const express = require("express");
const routes = express.Router();
const bcrypt = require("bcrypt");
const teacherModel = require("../models/Teacher");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
routes.use(cookieParser());

const isAdminOrTeacher = require("../middlewares/admin&teacher");

//login
routes.post("/login", async (req, res) => {
  try {
    //finding teacher
    let teacher = await teacherModel.findOne({ email: req.body.email });
    if (!teacher) return res.send("something is wrong");
    //from hashed to normal
    bcrypt.compare(req.body.password, teacher.password, function (err, result) {
      if (result) {
        const token = jwt.sign(
          {
            id: teacherModel._id,
            role: "admin"   
          },
          process.env.JWT_SECRET
        );
        
        res.cookie("token", token);
        //send respone
        res.send("teacher can login");
      } else res.send("something is wrong");
      console.log(result);
    });
  } catch (err) {
    res.status(400).send({ error: "try again" });
  }
});
//logout
routes.get("/logout", function (req, res) {
  res.cookie("token", "");
  res.send("logout successfully");
});



module.exports = routes;
