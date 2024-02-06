const { Category } = require("../../models");

module.exports = {
  getAllCategory: async (req, res, next) => {
    try {
      const result = await Category.find({ isDeleted: false });
      return res.send(200, {
        message: "Lấy thông tin danh mục thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin danh mục không thành công",
      });
    }
  },

  getDetailCategory: async (req, res, next) => {
    try {
      const { id } = req.params;

      const payload = await Category.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy danh mục",
        });
      }

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Danh mục đã được xoá trước đó",
        });
      }

      return res.send(200, {
        message: "Tìm danh mục thành công",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin danh mục không thành công",
      });
    }
  },

  createCategory: async (req, res, next) => {
    try {
      const { name, description } = req.body;

      const error = [];

      const exitName = await Category.findOne({
        name: name,
      });
      if (exitName) error.push({ Name: "Tên danh mục đã tồn tại" });

      if (error.length > 0) {
        return res.send(400, {
          message: "Tạo không thành công",
          errors: error,
        });
      }

      const newCategory = new Category({
        name,
        description,
      });

      const payload = await newCategory.save();

      return res.send(200, {
        message: "Tạo danh mục thành công",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Tạo danh mục không thành công",
      });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      const payload = await Category.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy danh mục",
        });
      }

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Danh mục đã được xoá trước đó",
        });
      }

      await Category.findByIdAndUpdate(id, { isDeleted: true });

      return res.send(200, {
        message: "Xoá danh mục thành công",
      });
    } catch (error) {
      return res.send(404, {
        message: "Xoá danh mục không thành công",
      });
    }
  },

  updateCategory: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const payload = await Category.findById(id);

      const errors = [];
      const exitName = await Category.findOne({ name, _id: { $ne: id } });
      if (exitName) {
        errors.push({ name: "Tên danh mục đã tồn tại!" });
      }
      if (errors.length > 0) {
        return res.send(400, {
          message: "Cập nhật không thành công",
          errors: errors,
        });
      }

      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy danh mục",
        });
      }

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Danh mục đã được xoá trước đó",
        });
      }

      const result = await Category.findByIdAndUpdate(
        id,
        {
          name: name || this.name,
          description: description || this.description,
        },
        {
          new: true,
        }
      );
      return res.send(200, {
        message: "Cập nhật danh mục thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(404, {
        message: "Sửa danh mục không thành công",
      });
    }
  },
};
