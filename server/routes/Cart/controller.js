const { Cart, Customer } = require("../../models");

module.exports = {
  getAllCart: async (req, res, next) => {
    try {
      const result = await Cart.find().lean({ virtuals: true });

      return res.send(200, {
        message: "Lấy thông tin giỏ hàng thành công",
        payload: result,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res.send(400, {
        message: "Lấy thông tin giỏ hàng không thành công",
      });
    }
  },

  getDetailCart: async (req, res, next) => {
    try {
      const { id } = req.params;

      const payload = await Cart.findOne({ userId: id }).lean({
        virtual: true,
      });
      console.log("««««« payload »»»»»");
      if (payload) {
        return res.send(200, payload.cartList);
      } else {
        return res.send(200, []);
      }
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin giỏ hàng không thành công",
      });
    }
  },

  createCart: async (req, res, next) => {
    try {
      const { userId, cartList } = req.body;
      // console.log("««««« userId, cartList »»»»»", userId, cartList);

      const exitUser = await Customer.findById(userId);
      if (!exitUser) {
        return res.send(400, {
          message: "Không tìm thấy khách hàng này",
        });
      }

      const exitCart = await Cart.findOneAndUpdate({ userId: userId });
      console.log("««««« exitCart »»»»»", exitCart);
      if (!exitCart) {
        const newCart = new Cart({
          userId,
          cartList,
        });

        const payload = await newCart.save();
        return res.send(200, {
          message: "Lưu giỏ hàng thành công chưa",
          payload: payload,
        });
      } else {
        const exitCart = await Cart.findOneAndUpdate(
          { userId: userId },
          { cartList: cartList },
          {
            new: true,
          }
        );
        return res.send(200, {
          message: "Lưu giỏ hàng thành công rồi",
          payload: exitCart,
        });
      }
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res.send(400, {
        message: "Tạo giỏ hàng không thành công",
      });
    }
  },

  deleteCart: async (req, res) => {
    try {
      const { id } = req.params;

      const payload = await Cart.find({ userId: userId });
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy giỏ hàng",
        });
      }

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Sản phẩm đã được xoá trước đó",
        });
      }

      await Cart.findByIdAndUpdate(id, { isDeleted: true });

      return res.send(200, {
        message: "Xoá giỏ hàng thành công",
      });
    } catch (error) {
      return res.send(404, {
        message: "Xoá giỏ hàng không thành công",
      });
    }
  },
};
