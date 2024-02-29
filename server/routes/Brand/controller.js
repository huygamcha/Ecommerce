const { Brand } = require("../../models");

module.exports = {
  getAllBrand: async (req, res, next) => {
    try {
      const { categoryId } = req.query;
      let result;
      if (categoryId) {
        result = await Brand.find({ categoryId: categoryId })
          .populate("category")
          .sort({ createdAt: -1 });
      } else {
        return res.send(200, {
          message: "Lấy thông tin thương hiệu thành công",
          payload: [],
        });
      }

      return res.send(200, {
        message: "Lấy thông tin thương hiệu thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin thương hiệu không thành công",
      });
    }
  },

  getDetailBrand: async (req, res, next) => {
    try {
      const { id } = req.params;

      const payload = await Brand.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy thương hiệu",
        });
      }

      return res.send(200, {
        message: "Tìm thương hiệu thành công",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin thương hiệu không thành công",
      });
    }
  },

  createBrand: async (req, res, next) => {
    try {
      const { name, categoryId, pic } = req.body;

      const errors = {};

      const exitName = await Brand.findOne({
        name: name,
      });
      if (exitName) errors.name = "Tên thương hiệu đã tồn tại";

      if (Object.keys(errors).length > 0) {
        return res.send(400, {
          message: "Tạo không thành công",
          errors: errors,
        });
      }

      const newBrand = new Brand({
        name,
        categoryId,
        pic,
      });
      const payload = await newBrand.save();

      return res.send(200, {
        message: "Tạo thương hiệu thành công",
        payload: payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res.send(400, {
        message: "Tạo thương hiệu không thành công",
      });
    }
  },

  deleteBrand: async (req, res) => {
    try {
      const { id } = req.params;

      const payload = await Brand.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy thương hiệu",
        });
      }

      await Brand.findByIdAndDelete(id, { isDeleted: true });

      return res.send(200, {
        message: "Xoá thương hiệu thành công",
      });
    } catch (error) {
      return res.send(404, {
        message: "Xoá thương hiệu không thành công",
      });
    }
  },

  updateBrand: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, categoryId, pic } = req.body;
      const payload = await Brand.findById(id);

      const errors = {};
      const exitName = await Brand.findOne({ name, _id: { $ne: id } });
      if (exitName) {
        errors.name = "Tên thương hiệu đã tồn tại!";
      }
      if (Object.keys(errors).length > 0) {
        return res.send(400, {
          message: "Cập nhật không thành công",
          errors: errors,
        });
      }

      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy thương hiệu",
        });
      }

      const result = await Brand.findByIdAndUpdate(
        id,
        {
          name: name || this.name,
          categoryId: categoryId || this.categoryId,
          pic: pic || this.pic,
        },
        {
          new: true,
        }
      );
      return res.send(200, {
        message: "Cập nhật thương hiệu thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(404, {
        message: "Sửa thương hiệu không thành công",
      });
    }
  },
};
