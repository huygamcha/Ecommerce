const { Policy } = require("../../models");
const { fuzzySearch } = require("../../utils");

module.exports = {
  getAllPolicy: async (req, res, next) => {
    try {
      const result = await Policy.find().sort({ createdAt: -1 });
      if (result)
        return res.send(200, {
          message: "Lấy thông tin cửa hàng thành công",
          payload: result,
        });
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin cửa hàng không thành công",
      });
    }
  },

  getDetailPolicy: async (req, res, next) => {
    try {
      const { search } = req.params;

      const payload = await Policy.findOne({ slug: fuzzySearch(search) });
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy chính sách",
        });
      }
      return res.send(200, {
        message: "Tìm chính sách thành công",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin chính sách không thành công",
      });
    }
  },

  createPolicy: async (req, res, next) => {
    try {
      const { name, content } = req.body;

      const newPolicy = new Policy({
        content,
        name,
      });
      const error = {};
      const exitName = await Policy.findOne({
        name: name,
      });

      if (exitName) error.name = "Tên chính sách đã tồn tại";

      if (Object.keys(error).length > 0) {
        return res.send(400, {
          message: "Tạo không thành công",
          errors: error,
        });
      }

      const payload = await newPolicy.save();

      return res.send(200, {
        message: "Tạo thông tin cửa hàng thành công",
        payload: payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res.send(400, {
        message: "Tạo thông tin cửa hàng không thành công",
      });
    }
  },

  deletePolicy: async (req, res) => {
    try {
      const { id } = req.params;

      const payload = await Policy.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy thông tin cửa hàng",
        });
      }

      await Policy.findByIdAndDelete(id, { isDeleted: true });

      return res.send(200, {
        message: "Xoá thông tin cửa hàng thành công",
      });
    } catch (error) {
      return res.send(404, {
        message: "Xoá thông tin cửa hàng không thành công",
      });
    }
  },

  updatePolicy: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, content } = req.body;
      const payload = await Policy.findById(id);

      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy thông tin cửa hàng",
        });
      }

      const result = await Policy.findByIdAndUpdate(
        id,
        {
          name: name || this.name,
          content: content || this.content,
        },
        {
          new: true,
        }
      );
      return res.send(200, {
        message: "Cập nhật thông tin cửa hàng thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(404, {
        message: "Sửa thông tin cửa hàng không thành công",
      });
    }
  },
};
