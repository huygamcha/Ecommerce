const { Customer } = require("../../models");

module.exports = {
  getAllCustomer: async (req, res, next) => {
    try {
      const result = await Customer.find();
      return res.send(200, {
        message: "Lấy thông tin khách hàng thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin khách hàng không thành công",
      });
    }
  },

  getDetailCustomer: async (req, res, next) => {
    try {
      const { id } = req.params;

      const payload = await Customer.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy khách hàng",
        });
      }

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Khách hàng đã được xoá trước đó",
        });
      }

      return res.send(200, {
        message: "Tìm khách hàng thành công",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin khách hàng không thành công",
      });
    }
  },

  createCustomer: async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        birthday,
        password,
        avatar,
      } = req.body;

      const errors = {};
      const exitPhoneNumber = await Customer.findOne({
        phoneNumber: phoneNumber,
      });
      if (exitPhoneNumber) errors.phoneNumber = "Số điện thoại đã tồn tại";

      const exitEmail = await Customer.findOne({
        email: email,
      });
      if (exitEmail) errors.email = "Email đã tồn tại";

      if (Object.keys(errors).length > 0) {
        return res.send(400, {
          message: "Tạo khách hàng không thành công",
          errors: errors,
        });
      }

      const newCustomer = new Customer({
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        birthday,
        password,
        avatar,
      });

      const payload = await newCustomer.save();
      return res.send(200, {
        message: "Tạo khách hàng thành công",
        payload: payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res.send(400, {
        message: "Tạo khách hàng không thành công",
        error: error,
      });
    }
  },

  deleteCustomer: async (req, res) => {
    try {
      const { id } = req.params;

      const payload = await Customer.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy khách hàng",
        });
      }

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Khách hàng đã được xoá trước đó",
        });
      }

      await Customer.findByIdAndUpdate(id, { isDeleted: true });

      return res.send(200, {
        message: "Xoá khách hàng thành công",
      });
    } catch (error) {
      return res.send(404, {
        message: "Xoá khách hàng không thành công",
      });
    }
  },

  updateCustomer: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        birthday,
        password,
        avatar,
      } = req.body;

      console.log("««««« password  update»»»»»", password);

      const errors = {};
      const exitPhoneNumber = await Customer.findOne({
        phoneNumber: phoneNumber,
      });
      if (exitPhoneNumber) errors.phoneNumber = "Số điện thoại đã tồn tại";

      const exitEmail = await Customer.findOne({
        email: email,
      });
      if (exitEmail) errors.email = "Email đã tồn tại";

      if (Object.keys(errors).length > 0) {
        return res.send(400, {
          message: "Cập nhật khách hàng không thành công",
          errors: errors,
        });
      }

      const payload = await Customer.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy khách hàng",
        });
      }

      // if (payload.isDeleted) {
      //   return res.send(404, {
      //     message: "Khách hàng đã được xoá trước đó",
      //   });
      // }

      const result = await Customer.findByIdAndUpdate(
        id,
        {
          phoneNumber: phoneNumber || this.phoneNumber,
          email: email || this.email,
          address: address || this.address,
          firstName: firstName || this.firstName,
          lastName: lastName || this.lastName,
          password: password || this.password,
          birthday: birthday || this.birthday,
          avatar: avatar || this.avatar,
        },
        {
          new: true,
        }
      );

      return res.send(404, {
        message: "Cập nhật khách hàng thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(404, {
        message: "Sửa khách hàng không thành công",
      });
    }
  },
};
