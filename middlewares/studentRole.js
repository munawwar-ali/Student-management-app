module.exports = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ error: "teacher access only" });
  }
  next();
};