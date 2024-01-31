const { Employee } = require("../../models");

module.exports = {
  getAllEmployee: async (req, res, next) => {
    try {
      const result = await Employee.find();
      return res.send(200, {
        message: "Lấy thông tin nhân viên thành công",
        payload: result,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res.send(400, {
        message: "Lấy thông tin nhân viên không thành công",
      });
    }
  },

  getDetailEmployee: async (req, res, next) => {
    try {
      const { id } = req.params;

      const payload = await Employee.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy nhân viên",
        });
      }

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Danh mục đã được xoá trước đó",
        });
      }

      return res.send(200, {
        message: "Tìm nhân viên thành công",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin nhân viên không thành công",
      });
    }
  },

  createEmployee: async (req, res, next) => {
    try {
      const { firstName, lastName, email, phoneNumber, address, birthday } =
        req.body;

      const error = [];
      const exitPhoneNumber = await Employee.findOne({
        phoneNumber: phoneNumber,
      });
      if (exitPhoneNumber)
        error.push({ phoneNumber: "Số điện thoại đã tồn tại" });
      const exitEmail = await Employee.findOne({
        email: email,
      });
      if (exitEmail) error.push({ email: "Email đã tồn tại" });

      if (error.length > 0) {
        return res.send(400, {
          message: "Tạo không thành công",
          errors: error,
        });
      }

      const newEmployee = new Employee({
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        birthday,
      });

      const payload = await newEmployee.save();
      return res.send(200, {
        message: "Tạo nhân viên thành công",
        payload: payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res.send(400, {
        message: "Tạo nhân viên không thành công",
        error: error,
      });
    }
  },

  deleteEmployee: async (req, res) => {
    try {
      const { id } = req.params;

      const payload = await Employee.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy nhân viên",
        });
      }

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Danh mục đã được xoá trước đó",
        });
      }

      await Employee.findByIdAndUpdate(id, { isDeleted: true });

      return res.send(200, {
        message: "Xoá nhân viên thành công",
      });
    } catch (error) {
      return res.send(404, {
        message: "Xoá nhân viên không thành công",
      });
    }
  },

  updateEmployee: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { firstName, lastName, email, phoneNumber, address, birthday } =
        req.body;

      const errors = [];
      const exitEmail = await Employee.findOne({ email, _id: id });
      if (exitEmail) {
        errors.push({ email: "Email nhân viên đã tồn tại" });
      }
      const exitPhoneNumber = await Employee.findOne({ phoneNumber, _id: id });
      if (exitPhoneNumber) {
        errors.push({ phoneNumber: "Số điện thoại nhân viên đã tồn tại" });
      }

      if (errors.length > 0) {
        return res.send(400, {
          message: "Cập nhật nhân viên không thành công",
          errors: errors,
        });
      }

      const payload = await Employee.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy nhân viên",
        });
      }

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Danh mục đã được xoá trước đó",
        });
      }

      const result = await Employee.findByIdAndUpdate(
        id,
        {
          name: name || this.name,
          phoneNumber: phoneNumber || this.phoneNumber,
          email: email || this.email,
          address: address || this.address,
        },
        {
          new: true,
        }
      );

      return res.send(404, {
        message: "Cập nhật nhân viên thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(404, {
        message: "Sửa nhân viên không thành công",
      });
    }
  },
};
