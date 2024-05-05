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
      console.log("««««« token »»»»»", token);
      const decoded = jwt.verify(token, process.env.SECRET);
      console.log("««««« decoded »»»»»", decoded);
      const expirationTime = decoded.exp * 1000; // Chuyển đổi thời gian hết hạn từ giây sang mili giây
      const currentTime = Date.now();

      if (currentTime > expirationTime) {
        return res.status(401).json({ message: "Hết hạn token" });
      }

      const checkCustomer = Customer.findById(decoded.user._id).select(
        "-password"
      );
      const checkEmployee = Employee.findById(decoded.user._id).select(
        "-password"
      );

      const [exitCustomer, exitEmployee] = await Promise.all([
        checkCustomer,
        checkEmployee,
      ]);

      if (exitCustomer) req.user = exitCustomer;
      if (exitEmployee) req.user = exitEmployee;
      next();
    } catch (e) {
      console.log("««««« e »»»»»", e);
      return res.send(400, {
        message: "Không có quyền truy cập",
      });
    }
  }
  if (!token) {
    console.log("««««« token »»»»»", token);
    return res.send(400, {
      message: "Không có quyền truy cập!",
    });
  }
};

const admin = async (req, res, next) => {
  try {
    const admin = req.user.isAdmin;
    if (admin) {
      console.log("««««« admin »»»»»", admin);
      next();
    } else {
      return res.send(400, {
        message: "Bạn không phải là admin",
      });
    }
  } catch (e) {
    return res.send(400, {
      message: "Bạn không phải là admin",
    });
  }
};
module.exports = { protect, admin };
