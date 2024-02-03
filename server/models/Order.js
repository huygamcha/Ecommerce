const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const { Schema, model } = mongoose;

const orderDetailSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: [true, "productId không được bỏ trống"],
    },
    name: {
      type: String,
      require: [true, "Tên sản phẩm không được bỏ trống"],
      maxLength: [50, "Tên sản phẩm không được quá 50 kí tự"],
    },
    quantity: {
      type: Number,
      min: [0, "Số lượng sản phẩm không được âm"],
    },
    price: {
      type: Number,
      min: [0, "Giá sản phẩm không được âm"],
    },
    discount: {
      type: Number,
      min: [0, "Giảm giá sản phẩm không được âm"],
      max: [75, "Giảm giá sản phẩm không được âm"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

orderDetailSchema.virtual("product", {
  ref: "product",
  localField: "productId",
  foreignField: "_id",
  justOne: true,
});

orderDetailSchema.set("toJSON", { virtuals: true });
orderDetailSchema.set("toObject", { virtuals: true });

const orderSchema = new Schema(
  {
    createDate: {
      type: Date,
      default: Date.now,
    },

    shippedDate: {
      type: Date,
      // required: [true, "shippedDate không được bỏ trống"],
      validate: {
        validator: function (value) {
          if (value < this.createDate) return false;
        },
        messages: "shippedDate được không nhỏ hơn createDate",
      },
    },

    status: {
      type: String,
      required: [true, "Trạng thái đơn hàng không được bỏ trống"],
      default: "WAITING",
      validate: {
        validator: function (value) {
          if (!value) return false;
          if (["WAITING", "COMPLETED", "CANCEL"].includes(value.toUpperCase()))
            return true;
          return false;
        },
        message: "Trạng thái đơn hàng bị lỗi",
      },
    },

    description: {
      type: String,
      max: [500, "Mô tả đơn hàng không được lớn hơn 500 kí tự"],
    },

    paymentType: {
      type: String,
      required: [true, "Hình thức thanh toán đơn hàng không được bỏ trống"],
      validate: {
        validator: function (value) {
          if (["CASH", "CREDIT CARD"].includes(value.toUpperCase()))
            return true;
          return false;
        },
      },
      default: "CASH",
      message: "Hình thức thanh toán đơn hàng bị lỗi",
    },

    customerId: {
      type: Schema.Types.ObjectId,
      ref: "customer",
      required: [true, "customerId không được bỏ trống"],
    },

    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "employee",
      required: [true, "employeeId không được bỏ trống"],
    },

    orderDetails: [orderDetailSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

orderSchema.virtual("employee", {
  ref: "employee",
  localField: "employeeId",
  foreignField: "_id",
  justOne: true,
});

orderSchema.virtual("customer", {
  ref: "customer",
  localField: "customerId",
  foreignField: "_id",
  justOne: true,
});

orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });
//
orderSchema.plugin(mongooseLeanVirtuals);

const Order = model("order", orderSchema);
module.exports = Order;
