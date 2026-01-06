const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/systemDb")
  .then(() => {
    console.log("Database Connected");
  })
  .catch(function (err) {
    console.log(err);
  });
