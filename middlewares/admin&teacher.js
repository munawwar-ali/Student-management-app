module.exports = function (req, res, next) {
  if (
    req.user.role !== "admin" &&
    req.user.role !== "teacher"
  ) {
    return res.status(403).send({
      error: "Access denied"
    });
  }
  next();
};