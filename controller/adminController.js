const adminModel = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req,res) => {
     try {
        //finding admin
        let admin = await adminModel.findOne({ email: req.body.email });
        if (!admin) return res.send("something is wrong");
        //from hashed to normal
        bcrypt.compare(req.body.password, admin.password, function (err, result) {
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
    
}