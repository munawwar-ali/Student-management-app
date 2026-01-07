const express = require("express");
const routes = express.Router();
const adminModel = require("../models/Admin");
const studentModel = require("../models/Students");
const bcrypt = require("bcrypt");
const teacherModel = require("../models/Teacher");
const taskModel = require('../models/Task')
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const isLogedIn = require("../middlewares/auth");
const isAdmin = require('../middlewares/adminRole')
const isAdminOrTeacher = require('../middlewares/admin&teacher')

routes.use(cookieParser());

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
        let token = jwt.sign(
          { id: adminModel._id, role: adminModel.role },
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

routes.get("/logout", function (req, res) {
  res.cookie("token", "");
  res.send("logout successfully");
});

//teacher routes
routes.get("/teacher",isLogedIn,isAdmin, async function (req, res) {
  try {
    const teacher = await teacherModel.find();
    res.send(teacher);
  } catch (error) {
    res.status(500).send({ error: "server failed" });
  }
});
routes.post("/create/teacher",isLogedIn,isAdmin, async function (req, res) {
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

    //send response
    res.status(201).send({
      createTeacher,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server failed" });
  }
});

routes.post("/update/:teacherId",isLogedIn, isAdmin,async function (req, res) {
  try {
    // saving data from req.body
    const { name, email, password, role, subject, salary, address } = req.body;
    //find and update
    let updatedteacher = await teacherModel.findOneAndUpdate(
      { _id: req.params.teacherId },
      { name, email, role, subject, salary, address },
      { new: true }
    );
    //sending response
    res.send(updatedteacher);
  } catch (error) {
    console.error(err);

    res.status(500).json({ error: "Server failed" });
  }
});

//students routes
routes.post("/create/student",isLogedIn,isAdmin, async function (req, res) {
  try {
    const {
      name,
      email,
      password,
      role,
      classStudent,
      fees,
      address,
      teacherIds,
    } = req.body;

    // basic validation
    if (!name || !email || !password) {
      return res.status(400).send({
        error: "name, email and password all required",
      });
    }

    // checking student existing or not
    const existingStudent = await studentModel.findOne({ email });
    if (existingStudent) {
      return res.status(409).send({
        error: "student already exists",
      });
    }

    // checking teacher is available or not
    const teacher = await teacherModel.findById(teacherIds);
    if (!teacher) {
      return res.status(404).send({
        message: "Teacher not found",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // calculate due fees
    const due = fees.total - fees.paid;

    // create student
    const createdStudent = await studentModel.create({
      name,
      email,
      password: hashedPassword,
      role,
      classStudent,
      address,
      fees: {
        total: fees.total,
        paid: fees.paid,
        due,
      },
      teacher: teacherIds,
    });

    // send response
    res.status(201).send({
      message: "Student created successfully",
      createdStudent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Server failed for some reasons",
    });
  }
});

routes.get("/students",isLogedIn,isAdmin, async function (req, res) {
  try {
    const students = await studentModel.find();
    res.send(students);
  } catch (error) {
    res.status(500).send({ error: "server failed" });
  }
});

routes.post("/update/:studentId", isLogedIn,isAdmin,async function (req, res) {
  try {
    // saving data from req.body
    const {
      name,
      email,
      role,
      classStudent,
      fees,
      address,
      teacherIds,
    } = req.body;
    //find and update
    let updateStudents = await studentModel.findOneAndUpdate(
      { _id: req.params.studentId },
      {
      name,
      email,
      role,
      classStudent,
      fees,
      address,
      teacherIds,
    },
      { new: true }
    );
    //sending response
    res.send(updateStudents);
  } catch (error) {
    console.error(err);

    res.status(500).json({ error: "Server failed" });
  }
});

//task creation by admin

routes.post("/create/tasks",isLogedIn,isAdminOrTeacher, async (req, res) => {
  try {
    const { title, description, givenby, status, date} = req.body;
    // checking asigner is available or not
    const asigner = await teacherModel.findById(givenby);
    if (!asigner) {
      return res.status(404).send({
        message: "asigner not found",
      })}
     const createTask = await taskModel.create({
  title,
  description,
  givenby,
  status,
  date: {
    publisDate: date.publisDate,
    startDate: date.startDate,
    endDate: date.endDate,
  },
});

      // send response
    res.status(201).send({
      message: "Task created successfully",
      createTask,
    });
    
  }  catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Server failed for some reasons",
    });
  }
});

routes.get("/tasks",isLogedIn,isAdmin, async function (req, res) {
  try {
    const tasks= await taskModel.find();
    res.send(tasks);
  } catch (error) {
    res.status(500).send({ error: "server failed" });
  }
});

routes.post("/update/:taskId", isLogedIn,isAdminOrTeacher, async function (req, res) {
  try {
    // saving data from req.body
     const { title, description, givenby, status, date} = req.body;
    //find and update
    let updatetasks = await taskModel.findOneAndUpdate(
      { _id: req.params.taskId },
     { title, description, givenby, status, date},
      { new: true }
    );
    //sending response
    res.send(updatetasks);
  } catch (error) {
    console.error(err);

    res.status(500).json({ error: "Server failed" });
  }
});

routes.get("/", function (req, res) {
  res.send("hello");
  console.log("meow");
});

module.exports = routes;
