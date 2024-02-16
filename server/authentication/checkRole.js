const jwt = require("jsonwebtoken");
const { Employee, Customer } = require("../models");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET);

      const checkCustomer = Customer.findById(decoded._id).select("-password");
      const checkEmployee = Employee.findById(decoded._id).select("-password");

      const [exitCustomer, exitEmployee] = await Promise.all([
        checkCustomer,
        checkEmployee,
      ]);
      if (exitCustomer) req.user = exitCustomer;
      if (exitEmployee) req.user = exitEmployee;

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

const admin = async (req, res, next) => {
  try {
    const admin = req.user.admin;
    if (admin) {
      next();
    } else {
      return res.send(400, {
        message: "Không có quyền truy cập",
      });
    }
  } catch (e) {
    return res.send(400, {
      message: "Không có quyền truy cập",
    });
  }
};
module.exports = { protect, admin };
