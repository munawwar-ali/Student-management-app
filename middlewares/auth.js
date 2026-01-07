const jwt = require('jsonwebtoken')

module.exports=(req, res, next)=> {
  const token = req.cookies.token;

  if (!token) {
    return res.send("something wrong");
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    next();
  } catch (err) {
    return res.redirect("/login");
  }
}
