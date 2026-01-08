module.exports = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ error: "teacher access only" });
  }
  next();
};
