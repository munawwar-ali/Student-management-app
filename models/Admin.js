const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    
  },
  password:{
    type:String,
    required:true,
    minlength:8
  },
  role:{
    type:String,
    default:'admin'
  }
});

module.exports = mongoose.model('admin',adminSchema)
