const express = require("express");
const routes = express.Router();
const teacherModel = require("../models/Teacher");
const taskModel = require('../models/Task')
const isLogedIn = require("../middlewares/auth");
const isAdmin = require('../middlewares/adminRole')
const isAdminOrTeacher = require('../middlewares/admin&teacher')





routes.post("/create/tasks", isLogedIn, isAdminOrTeacher, async (req, res) => {
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

routes.post("/update/:taskId",isLogedIn,isAdminOrTeacher,
  async function (req, res) {
    try {
      // saving data from req.body
      const { title, description, givenby, status, date } = req.body;
      //find and update
      let updatetasks = await taskModel.findOneAndUpdate(
        { _id: req.params.taskId },
        { title, description, givenby, status, date },
        { new: true }
      );
      //sending response
      res.send(updatetasks);
    } catch (error) {
      console.error(err);

      res.status(500).json({ error: "Server failed" });
    }
  }
);

module.exports = routes;
