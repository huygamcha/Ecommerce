const { Tag } = require("../../models");

module.exports = {
  getAllTag: async (req, res, next) => {
    try {
      const result = await Tag.find();
      return res.send(200, {
        message: "Lấy thông tin tag thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin tag không thành công",
      });
    }
  },

  getDetailTag: async (req, res, next) => {
    try {
      const { id } = req.params;

      const payload = await Tag.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy tag",
        });
      }

      return res.send(200, {
        message: "Tìm tag thành công",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin tag không thành công",
      });
    }
  },

  getDetailTagSlug: async (req, res, next) => {
    try {
      const { tag } = req.params;

      const payload = await Tag.findOne({ name: tag });
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy nhãn",
        });
      }
      return res.send(200, {
        message: "Tìm nhãn thành công",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin nhãn không thành công",
      });
    }
  },

  createTag: async (req, res, next) => {
    try {
      const { name } = req.body;

      const error = {};
      const exitName = await Tag.findOne({
        name: name,
      });

      if (exitName) error.name = "Tên tag đã tồn tại";

      if (Object.keys(error).length > 0) {
        return res.send(400, {
          message: "Tạo không thành công",
          errors: error,
        });
      }

      const newTag = new Tag({
        name,
      });

      const payload = await newTag.save();

      return res.send(200, {
        message: "Tạo tag thành công",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Tạo tag không thành công",
      });
    }
  },

  deleteTag: async (req, res) => {
    try {
      const { id } = req.params;

      const payload = await Tag.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy tag",
        });
      }

      await Tag.findByIdAndDelete(id, { isDeleted: true });

      return res.send(200, {
        message: "Xoá tag thành công",
      });
    } catch (error) {
      return res.send(404, {
        message: "Xoá tag không thành công",
      });
    }
  },

  updateTag: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const error = {};
      const exitName = await Tag.findOne({
        name: name,
        _id: { $ne: id },
      });
      if (exitName) error.name = "Tên tag đã tồn tại";

      if (Object.keys(error).length > 0) {
        return res.send(400, {
          message: "Tạo không thành công",
          errors: error,
        });
      }

      const payload = await Tag.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy tag",
        });
      }

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Tag đã được xoá trước đó",
        });
      }

      const result = await Tag.findByIdAndUpdate(
        id,
        {
          name: name || this.name,
        },
        {
          new: true,
        }
      );
      return res.send(200, {
        message: "Cập nhật tag thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(404, {
        message: "Sửa tag không thành công",
      });
    }
  },
};
