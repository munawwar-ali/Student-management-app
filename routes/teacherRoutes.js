const express = require("express");
const routes = express.Router();
const bcrypt = require("bcrypt");
const isLogedIn = require("../middlewares/auth");
const teacherModel = require("../models/Teacher");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
routes.use(cookieParser());

const isTeacher = require("../middlewares/teacherRole");



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
            role: "teacher",
          },
          process.env.JWT_SECRET
        );

        res.cookie("token", token);
        //send respone
        res.send("teacher login successfully");
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

//student details
routes.post(
  "/teacher/update/:studentId",
  isLogedIn,
  isTeacher,
  async function (req, res) {
    try {
      const { attendence, fees } = req.body;

      let updatedstudent = await studentModel.findOneAndUpdate(
        { _id: req.params.studentId },
        { attendence, fees },
        { new: true }
      );

      if (!updatedstudent) {
        return res.status(404).send("student not found");
      }

      res.send(updatedstudent);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server failed" });
    }
  }
);

routes.get("/teacher/student/:id", isLogedIn, isTeacher, async (req, res) => {
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
