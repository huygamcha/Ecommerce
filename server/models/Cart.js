const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "customer",
    },

    cartList: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "product",
        },

        name: {
          type: String,
          require: [true, "Tên sản phẩm không được bỏ trống"],
          maxLength: [50, "Tên sản phẩm không được quá 50 kí tự"],
          unique: [true, "Tên sản phẩm không được trùng"],
        },

        price: {
          type: Number,
          require: [true, "Giá sản phẩm không được bỏ trống"],
          default: 0,
          min: [0, "Giá sản phẩm không được âm"],
        },

        discount: {
          type: Number,
          require: [true, "Phần trăm giảm giá sản phẩm không được bỏ trống"],
          default: 0,
          min: [0, "Phần trăm giảm giá sản phẩm không được âm"],
          max: [75, "Phần trăm giảm giá sản phẩm không được nhỏ hơn 75%"],
        },

        stock: {
          type: Number,
          require: [true, "Số lượng sản phẩm không được bỏ trống"],
          default: 0,
          min: [0, "Số lượng sản phẩm không được âm"],
        },

        total: {
          type: Number,
          min: [0, "Tổng giá tiền sản phẩm không được âm"],
        },

        pic: {
          type: String,
        },

        quantity: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

cartSchema.set("toJSON", { virtuals: true });
cartSchema.set("toObject", { virtuals: true });
//
cartSchema.plugin(mongooseLeanVirtuals);

const Cart = model("cart", cartSchema);
module.exports = Cart;
