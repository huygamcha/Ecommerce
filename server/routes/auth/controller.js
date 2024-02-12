const JWT = require("jsonwebtoken");

const {
  generateToken,
  generateRefreshToken,
} = require("../../utils/jwtHelper");
const { Customer, Employee } = require("../../models");

module.exports = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const userEmployee = Employee.findOne({ email });
      const userCustomer = Customer.findOne({ email });
      const [exitEmployee, exitCustomer] = await Promise.all([
        userEmployee,
        userCustomer,
      ]);
      if (exitEmployee) user = exitEmployee;
      if (exitCustomer) user = exitCustomer;
      user.password = "fake";
      if (user && user.isValidPass(password)) {
        res.send(200, {
          message: "Đăng nhập thành công",
          payload: {
            token: generateToken(user),
            refreshToken: generateRefreshToken(user._id),
          },
        });
      }
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.send(500, { code: 500, error: err });
    }
  },

  checkRefreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      JWT.verify(refreshToken, process.env.SECRET, async (err, payload) => {
        if (err) {
          return res.status(401).json({
            message: "refreshToken is invalid",
          });
        } else {
          const { id } = payload;

          const customer = await Customer.findOne({
            _id: id,
            isDeleted: false,
          })
            .select("-password")
            .lean();

          if (customer) {
            const {
              _id,
              firstName,
              lastName,
              phoneNumber,
              address,
              email,
              birthday,
              updatedAt,
            } = customer;

            const token = generateToken({
              _id,
              firstName,
              lastName,
              phoneNumber,
              address,
              email,
              birthday,
              updatedAt,
            });

            return res.status(200).json({ token });
          }
          return res.sendStatus(401);
        }
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      res.status(400).json({
        statusCode: 400,
        message: "Lỗi",
      });
    }
  },

  basicLogin: async (req, res, next) => {
    try {
      const user = await Customer.findById(req.user._id)
        .select("-password")
        .lean();
      const token = generateToken(user);
      // const refreshToken = generateRefreshToken(user._id);

      res.json({
        token,
        // refreshToken,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      res.sendStatus(400);
    }
  },

  getMe: async (req, res, next) => {
    try {
      res.status(200).json({
        message: "Layas thoong tin thanfh coong",
        payload: req.user,
      });
    } catch (err) {
      res.sendStatus(500);
    }
  },
};
