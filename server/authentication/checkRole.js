const jwt = require("jsonwebtoken");
const { Employee } = require("../models");

const admin = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = await Employee.findById(decoded.id).select("-password");
      next();
    } catch (e) {
      return res.send(400, {
        message: "Không có quyền truy cập",
      });
    }
  }
  if (!token) {
    return res.send(400, {
      message: "Không có quyền truy cập!",
    });
  }
};
module.exports = { admin };
