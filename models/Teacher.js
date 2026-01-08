const mongoose = require("mongoose");

const teacherSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required:true,
    default: "teacher",
  },
  subject: String,
  salary: Number,
  address: String,
});

module.exports = mongoose.model("teacher", teacherSchema);
