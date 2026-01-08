const express = require("express");
const routes = express.Router();
const bcrypt = require("bcrypt");
const isLogedIn = require("../middlewares/auth");
const studentModel = require('../models/Students')
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
routes.use(cookieParser());
const isStudent = require('../middlewares/studentRole')


//login

routes.post("/login", async (req, res) => {
  try {
    //finding student
    let student = await studentModel.findOne({ email: req.body.email });
    if (!student) return res.send("something is wrong");
    //from hashed to normal
    bcrypt.compare(req.body.password, student.password, function (err, result) {
      if (result) {
        const token = jwt.sign(
          {
            id: studentModel._id,
            role: "student",
          },
          process.env.JWT_SECRET
        );

        res.cookie("token", token);

        //send respone
        res.send("You can login");
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
//getting the detail of fees and attendence
routes.get("/student/:id", isLogedIn, isStudent, async (req, res) => {
  try {
    const student = await studentModel
      .findById(req.params.id)
      .select("name classStudent attendene fees");

    if (!student) {
      return res.status(404).json({ message: "student not found" });
    }

    res.json(student);
  } catch (err) {
    res.status(400).json({ error: "Invalid student ID" });
  } 
});


module.exports = routes;
