const { Location } = require("../../models");

module.exports = {
  getAllLocation: async (req, res, next) => {
    try {
      const result = await Location.find().sort({ createdAt: -1 });
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

  getDetailLocation: async (req, res, next) => {
    try {
      const { id } = req.params;

      const payload = await Location.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy Location",
        });
      }
      return res.send(200, {
        message: "Tìm Location thành công",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin Location không thành công",
      });
    }
  },

  createLocation: async (req, res, next) => {
    try {
      const { time, map, name, address, album, iframe, description } = req.body;

      const newLocation = new Location({
        time,
        map,
        address,
        name,
        album,
        iframe,
        description,
      });

      const payload = await newLocation.save();

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

  deleteLocation: async (req, res) => {
    try {
      const { id } = req.params;

      const payload = await Location.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy thông tin cửa hàng",
        });
      }

      await Location.findByIdAndDelete(id, { new: true });

      return res.send(200, {
        message: "Xoá thông tin cửa hàng thành công",
      });
    } catch (error) {
      return res.send(404, {
        message: "Xoá thông tin cửa hàng không thành công",
      });
    }
  },

  updateLocation: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { time, map, address, name, album, iframe, description } = req.body;
      const payload = await Location.findById(id);

      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy thông tin cửa hàng",
        });
      }

      const result = await Location.findByIdAndUpdate(
        id,
        {
          time: time || this.time,
          address: address || this.address,
          name: name || this.name,
          map: map || this.map,
          album: album || this.album,
          iframe: iframe || this.iframe,
          description: description || this.description,
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
