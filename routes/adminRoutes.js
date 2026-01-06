const express = require("express");
const routes = express.Router();
const adminModel = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const teacherModel = require("../models/Teacher");

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

routes.use(cookieParser());

routes.get("/login", async (req, res) => {
  res.send("logged in");
});

routes.post("/login", async (req, res) => {
  try {
    let user = await adminModel.findOne({ email: req.body.email });
    if (!user) return res.send("something is wrong");

    bcrypt.compare(req.body.password, user.password, function (err, result) {
      if (result) {
        let token = jwt.sign({ email: user.email }, "king");
        res.cookie("token", token);

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

routes.post("/create/teacher", async function (req, res) {
  try {
    const { name, email, password, role, subject, salary, address } = req.body;

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

routes.get("/create/teacher", async function (req, res) {
  const products = await teacherModel.find();
  res.send(products);
});

routes.get("/", function (req, res) {
  res.send("hello");
  console.log("meow");
});

module.exports = routes;
