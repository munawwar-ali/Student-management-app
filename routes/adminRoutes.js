const express = require("express");
const routes = express.Router();
const adminModel = require("../models/Admin");
const studentModel = require('../models/Students')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const teacherModel = require("../models/Teacher");



// routes.use(cookieParser());

routes.get("/login", async (req, res) => {
  res.send("logged in");
});

routes.post("/login", async (req, res) => {
  try {
    //finding admin
    let admin = await adminModel.findOne({ email: req.body.email });
    if (!admin) return res.send("something is wrong");
    //from hashed to normal
    bcrypt.compare(req.body.password, admin.password, function (err, result) {
      if (result) {
        let token = jwt.sign({ email: admin.email }, "king");
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

routes.get("/logout", function (req, res) {
  res.cookie("token", "");
  res.send("logout successfully");
});
routes.get("/teacher", async function (req, res) {
  try {
    const teacher = await teacherModel.find();
  res.send(teacher);
  } catch (error) {
    res.status(500).send({error:"server failed"})
  }
  
});
routes.post("/create/teacher", async function (req, res) {
  try {
    const { name, email, password, role, subject, salary, address } = req.body;
    //basic validation
    if (!name || !email || !password) {
      res.status(400).send({ error: "name,email and password all requireds" });
    }
    //checking teacher existing or not
    const existingTeacher = await teacherModel.findOne({ email });
    if (existingTeacher) {
      return res.status(409).json({ error: "Teacher already exists" });
    }

    // now hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //creating a teacher
    const createTeacher = await teacherModel.create({
      name,
      email,
      password: hashedPassword,
      role,
      subject,
      salary,
      address,
    });

    //setup jwt

    const token = jwt.sign({ email }, "king");

    //send response
    res.status(201).send({
      createTeacher,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server failed" });
  }
});

routes.post('/update/:teacherId',async function (req,res) {
     try {
      // saving data from req.body
      const { name, email, password, role, subject, salary, address } = req.body;
      //find and update
    let updatedteacher = await teacherModel.findOneAndUpdate({_id:req.params.teacherId},{ name, email,role, subject, salary, address},{new:true})
    //sending response
    res.send(updatedteacher)
     } catch (error) {
      console.error(err);
      
        res.status(500).json({ error: "Server failed" });
     } 
})




//students routes



routes.get("/", function (req, res) {
  res.send("hello");
  console.log("meow");
});

module.exports = routes;
