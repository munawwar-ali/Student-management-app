const express = require("express");
const routes = express.Router();
const adminModel = require("../models/Admin");
const bcrypt = require("bcrypt");
const teacherModel = require("../models/Teacher");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
routes.use(cookieParser());

exports.adminLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    // empty field required
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //email format check
    const regexEmail = /^\S+@\S+\.\S+$/;
    if (!regexEmail.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    //finding admin
    let admin = await adminModel.findOne({ email });
    if (!admin) return res.send("something is wrong");
    //from hashed to normal
    bcrypt.compare(password, admin.password, function (err, result) {
      if (result) {
        const token = jwt.sign(
          {
            id: adminModel._id,
            role: "admin",
          },
          process.env.JWT_SECRET
        );

        res.cookie("token", token);

        //send respone
        res.send("login successfully");
      } else res.send("something is wrong");
      console.log(result);
    });
  } catch (err) {
    res.status(400).send({ error: "try again" });
  }
};

exports.teacherCreate = async function (req, res) {
  try {
    const { name, email, password, role, subject, salary, address } = req.body;
    //basic required validation
    if (!name || !email || !password || !role) {
      res
        .status(400)
        .send({ error: "name,email,role and password all requireds" });
    }
    //email format check
    const regexEmail = /^\S+@\S+\.\S+$/;
    if (!regexEmail.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    //checking teacher existing or not
    const existingTeacher = await teacherModel.findOne({ email });
    if (existingTeacher) {
      return res.status(409).json({ error: "Teacher already exists" });
    }
    //password checking validation
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
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

    //send response
    res.status(201).send({
      createTeacher,
      loginDetails: {
        email: email,
        password: password,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server failed" });
  }
};
