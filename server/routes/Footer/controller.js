const { Footer } = require("../../models");

module.exports = {
  getAllFooter: async (req, res, next) => {
    try {
      const result = await Footer.find().sort({ column: 1 });
      return res.send(200, {
        message: "Lấy thông tin footer thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin footer không thành công",
      });
    }
  },

  getDetailFooter: async (req, res, next) => {
    try {
      const { id } = req.params;

      const payload = await Footer.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy footer",
        });
      }
      return res.send(200, {
        message: "Tìm footer thành công",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin footer không thành công",
      });
    }
  },

  createFooter: async (req, res, next) => {
    try {
      const { name, url, column } = req.body;

      const errors = {};

      const exitName = await Footer.findOne({
        name: name,
      });
      if (exitName) errors.name = "Tên footer đã tồn tại";

      if (Object.keys(errors).length > 0) {
        return res.send(400, {
          message: "Tạo footer không thành công",
          errors: errors,
        });
      }

      const newFooter = new Footer({
        name,
        column,
        url,
      });

      const payload = await newFooter.save();

      return res.send(200, {
        message: "Tạo footer thành công",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Tạo footer không thành công",
        error: error,
      });
    }
  },

  deleteFooter: async (req, res) => {
    try {
      const { id } = req.params;

      const payload = await Footer.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy footer",
        });
      }

      await Footer.findByIdAndDelete(id, {
        new: true,
      });

      return res.send(200, {
        message: "Xoá footer thành công",
      });
    } catch (error) {
      return res.send(404, {
        message: "Xoá footer không thành công",
      });
    }
  },

  updateFooter: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, url, column } = req.body;
      const payload = await Footer.findById(id);

      const errors = {};

      const exitName = await Footer.findOne({
        name: name,
        _id: { $ne: id },
      });
      if (exitName) errors.name = "Tên footer đã tồn tại";

      if (Object.keys(errors).length > 0) {
        return res.send(400, {
          message: "Tạo footer không thành công",
          errors: errors,
        });
      }

      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy footer",
        });
      }

      const result = await Footer.findByIdAndUpdate(
        id,
        {
          name: name || this.name,
          url: url || this.url,
          column: column || this.column,
        },
        {
          new: true,
        }
      );
      return res.send(200, {
        message: "Cập nhật footer thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(404, {
        message: "Sửa footer không thành công",
      });
    }
  },
};
