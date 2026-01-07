const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  givenby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
   
  },
  status: {
    type: String,
    required: true,
   
  },
  date: {
    publisDate: {
      type: Date,
      required: true,
      default: null,
    },
    startDate: {
      type: Date,
      required: true,
      default: null,
    },
    endDate: {
      type: Date,
      required: true,
      default: null,
    },
  },
});

module.exports = mongoose.model("task", taskSchema);
