const { Banner } = require("../../models");

module.exports = {
  getAllBanner: async (req, res, next) => {
    try {
      const result = await Banner.find().sort({ createdAt: -1 });
      if (result)
        return res.send(200, {
          message: "Lấy thông tin ảnh bìa thành công",
          payload: result,
        });
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin ảnh bìa không thành công",
      });
    }
  },

  createBanner: async (req, res, next) => {
    try {
      const { pic, subBanner } = req.body;

      const newBanner = new Banner({
        pic,
        subBanner,
      });

      const payload = await newBanner.save();

      return res.send(200, {
        message: "Tạo ảnh bìa thành công",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Tạo ảnh bìa không thành công",
      });
    }
  },

  deleteBanner: async (req, res) => {
    try {
      const { id } = req.params;

      const payload = await Banner.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy ảnh bìa",
        });
      }

      await Banner.findByIdAndDelete(id, { new: true });

      return res.send(200, {
        message: "Xoá ảnh bìa thành công",
      });
    } catch (error) {
      return res.send(404, {
        message: "Xoá ảnh bìa không thành công",
      });
    }
  },

  updateBanner: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { pic, subBanner } = req.body;
      const payload = await Banner.findById(id);
      console.log("««««« subBanner »»»»»", subBanner);

      if (subBanner === false) {
        this.subBanner = false;
      }
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy ảnh bìa",
        });
      }

      const result = await Banner.findByIdAndUpdate(
        id,
        {
          pic: pic || this.pic,
          subBanner: subBanner || this.subBanner,
        },
        {
          new: true,
        }
      );
      console.log("««««« result »»»»»", result);
      return res.send(200, {
        message: "Cập nhật ảnh bìa thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(404, {
        message: "Sửa ảnh bìa không thành công",
      });
    }
  },
};
