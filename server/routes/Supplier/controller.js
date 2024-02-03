const { Supplier } = require("../../models");

module.exports = {
  getAllSupplier: async (req, res, next) => {
    try {
      const result = await Supplier.find();
      return res.send(200, {
        message: "Lấy thông tin nhà cung cấp thành công",
        payload: result,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res.send(400, {
        message: "Lấy thông tin nhà cung cấp không thành công",
      });
    }
  },

  getDetailSupplier: async (req, res, next) => {
    try {
      const { id } = req.params;

      const payload = await Supplier.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy nhà cung cấp",
        });
      }

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Danh mục đã được xoá trước đó",
        });
      }

      return res.send(200, {
        message: "Tìm nhà cung cấp thành công",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin nhà cung cấp không thành công",
      });
    }
  },

  createSupplier: async (req, res, next) => {
    try {
      const { name, email, phoneNumber, address } = req.body;

      const error = [];
      const exitPhoneNumber = await Supplier.findOne({
        phoneNumber: phoneNumber,
      });
      if (exitPhoneNumber)
        error.push({ phoneNumber: "Số điện thoại đã tồn tại" });
      const exitEmail = await Supplier.findOne({
        email: email,
      });
      if (exitEmail) error.push({ email: "Email đã tồn tại" });

      if (error.length > 0) {
        return res.send(400, {
          message: "Tạo không thành công",
          errors: error,
        });
      }

      const newSupplier = new Supplier({
        name,
        email,
        phoneNumber,
        address,
      });

      const payload = await newSupplier.save();
      return res.send(200, {
        message: "Tạo nhà cung cấp thành công",
        payload: payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res.send(400, {
        message: "Tạo nhà cung cấp không thành công",
        error: error,
      });
    }
  },

  deleteSupplier: async (req, res) => {
    try {
      const { id } = req.params;

      const payload = await Supplier.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy nhà cung cấp",
        });
      }

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Danh mục đã được xoá trước đó",
        });
      }

      await Supplier.findByIdAndUpdate(id, { isDeleted: true });

      return res.send(200, {
        message: "Xoá nhà cung cấp thành công",
      });
    } catch (error) {
      return res.send(404, {
        message: "Xoá nhà cung cấp không thành công",
      });
    }
  },

  updateSupplier: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, email, phoneNumber, address } = req.body;

      const errors = [];
      const exitEmail = await Supplier.findOne({ email, _id: { $ne: id } });
      if (exitEmail) {
        errors.push({ email: "Email nhà cung cấp đã tồn tại" });
      }
      const exitPhoneNumber = await Supplier.findOne({
        phoneNumber,
        _id: { $ne: id },
      });
      if (exitPhoneNumber) {
        errors.push({ phoneNumber: "Số điện thoại nhà cung cấp đã tồn tại" });
      }

      if (errors.length > 0) {
        return res.send(400, {
          message: "Cập nhật nhà cung cấp không thành công",
          errors: errors,
        });
      }

      const payload = await Supplier.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy nhà cung cấp",
        });
      }

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Danh mục đã được xoá trước đó",
        });
      }

      const result = await Supplier.findByIdAndUpdate(
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
        message: "Cập nhật nhà cung cấp thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(404, {
        message: "Sửa nhà cung cấp không thành công",
      });
    }
  },
};
