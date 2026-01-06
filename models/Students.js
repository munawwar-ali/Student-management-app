const mongoose = require("mongoose");

const studentsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "student",
  },
  address: {
    type: String,
  },
  fees: {
    total: {
      type: Number,
      required: true,
    },
    paid: {
      type: Number,
      default: 0,
    },
    due: {
      type: Number,
    },
    lastPaid: Date,
  },
  classStudent: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
});

module.exports = mongoose.model("students", studentsSchema);
