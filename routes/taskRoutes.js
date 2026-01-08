const express = require("express");
const routes = express.Router();
const teacherModel = require("../models/Teacher");
const taskModel = require("../models/Task");
const isLogedIn = require("../middlewares/auth");
const isAdmin = require("../middlewares/adminRole");

const isTeacher = require('../middlewares/teacherRole')
const isStudent = require('../middlewares/studentRole')

//admin 

routes.post("/create/tasks", isLogedIn,  async (req, res) => {
  try {
    const { title, description, givenby, status, date } = req.body;
    // checking asigner is available or not
    const asigner = await teacherModel.findById(givenby);
    if (!asigner) {
      return res.status(404).send({
        message: "asigner not found",
      });
    }
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
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Server failed for some reasons",
    });
  }
});

routes.get("/tasks", isLogedIn, isAdmin, async function (req, res) {
  try {
    const tasks = await taskModel.find();
    res.send(tasks);
  } catch (error) {
    res.status(500).send({ error: "server failed" });
  }
});

routes.post("/update/:taskId", isLogedIn, isAdmin, async function (req, res) {
 
  try {
    // saving data from req.body
    const { title, description, givenby, status, date } = req.body;
    //find and update
    let updatetasks = await taskModel.findOneAndUpdate(
      { _id: req.params.taskId },
      { title, description, givenby, status, date },
      { new: true }
    );

    if (!updatetasks) {
      return res.status(404).send("Task not found");
    }


    res.send(updatetasks);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Server failed" });
  }
});

routes.get("/:id",isLogedIn,isAdmin, async (req, res) => {
  try {
    const task = await taskModel.findById(req.params.id);

    if (!task)
      return res.status(404).json({ message: "task not found" });

    res.send(task);
  } catch (err) {
    res.status(400).json({ error: "Invalid task ID" });
  }
});


//teacher updating routes

routes.post("/teacher/update/:taskId", isLogedIn,isTeacher,
  async function (req, res) {
    try {
      const { title, description } = req.body;

      let updatedTask = await taskModel.findOneAndUpdate(
        { _id: req.params.taskId },
        { title, description },   
        { new: true }
      );

      if (!updatedTask) {
        return res.status(404).send("Task not found");
      }

      res.send(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server failed" });
    }
  }
);
routes.get("/teacher/task/:id", isLogedIn, isTeacher, async (req, res) => {
  try {
    const task = await taskModel
      .findById(req.params.id)
      .select("title description date");

    if (!task) {
      return res.status(404).json({ message: "task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(400).json({ error: "Invalid task ID" });
  }
});

//student getting task

routes.get("/student/task/:id", isLogedIn, isStudent, async (req, res) => {
  try {
    const task = await taskModel
      .findById(req.params.id)
      .select("title description date");

    if (!task) {
      return res.status(404).json({ message: "task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(400).json({ error: "Invalid task ID" });
  }
});




module.exports = routes;
