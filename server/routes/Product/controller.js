const { Product } = require("../../models");

module.exports = {
  getAllProduct: async (req, res, next) => {
    try {
      const result = await Product.find();
      return res.send(200, {
        message: "Lấy thông tin sản phẩm thành công",
        payload: result,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res.send(400, {
        message: "Lấy thông tin sản phẩm không thành công",
      });
    }
  },

  getDetailProduct: async (req, res, next) => {
    try {
      const { id } = req.params;

      const payload = await Product.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy sản phẩm",
        });
      }

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Danh mục đã được xoá trước đó",
        });
      }

      return res.send(200, {
        message: "Tìm sản phẩm thành công",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin sản phẩm không thành công",
      });
    }
  },

  createProduct: async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        birthday,
        password,
      } = req.body;

      const errors = [];
      const exitPhoneNumber = await Product.findOne({
        phoneNumber: phoneNumber,
      });
      if (exitPhoneNumber)
        errors.push({ phoneNumber: "Số điện thoại đã tồn tại" });
      const exitEmail = await Product.findOne({
        email: email,
      });
      if (exitEmail) errors.push({ email: "Email đã tồn tại" });

      if (errors.length > 0) {
        return res.send(400, {
          message: "Tạo không thành công",
          errors: errors,
        });
      }

      const newProduct = new Product({
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        birthday,
        password,
      });

      const payload = await newProduct.save();
      return res.send(200, {
        message: "Tạo sản phẩm thành công",
        payload: payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res.send(400, {
        message: "Tạo sản phẩm không thành công",
        error: error,
      });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const payload = await Product.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy sản phẩm",
        });
      }

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Danh mục đã được xoá trước đó",
        });
      }

      await Product.findByIdAndUpdate(id, { isDeleted: true });

      return res.send(200, {
        message: "Xoá sản phẩm thành công",
      });
    } catch (error) {
      return res.send(404, {
        message: "Xoá sản phẩm không thành công",
      });
    }
  },

  updateProduct: async (req, res, next) => {
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
      } = req.body;

      const errors = [];
      const exitEmail = await Product.findOne({ email, _id: id });
      if (exitEmail) {
        errors.push({ email: "Email sản phẩm đã tồn tại" });
      }
      const exitPhoneNumber = await Product.findOne({ phoneNumber, _id: id });
      if (exitPhoneNumber) {
        errors.push({ phoneNumber: "Số điện thoại sản phẩm đã tồn tại" });
      }

      if (errors.length > 0) {
        return res.send(400, {
          message: "Cập nhật sản phẩm không thành công",
          errors: errors,
        });
      }

      const payload = await Product.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy sản phẩm",
        });
      }

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Danh mục đã được xoá trước đó",
        });
      }

      const result = await Product.findByIdAndUpdate(
        id,
        {
          phoneNumber: phoneNumber || this.phoneNumber,
          email: email || this.email,
          address: address || this.address,
          firstName: firstName || this.firstName,
          lastName: lastName || this.lastName,
          password: password || this.password,
          birthday: birthday || this.birthday,
        },
        {
          new: true,
        }
      );

      return res.send(404, {
        message: "Cập nhật sản phẩm thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(404, {
        message: "Sửa sản phẩm không thành công",
      });
    }
  },
};
