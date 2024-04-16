const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const { Schema, model } = mongoose;

const productDetail = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  pic: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  // stock: {
  //   type: Number,
  //   required: true,
  // },
  total: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    // required: true,
  },
  categoryId: {
    type: String,
    // required: true,
  },
});

const orderSchema = new Schema(
  {
    status: {
      type: String,
      required: false,
    },
    nameOrder: {
      type: String,
      required: true,
    },
    phoneOrder: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    phone: {
      type: Number,
    },
    notice: {
      type: String,
    },
    addressDetail: {
      type: String,
    },
    commune: {
      type: String,
    },
    district: {
      type: String,
    },
    province: {
      type: String,
    },
    typePayment: {
      type: String,
    },
    listProduct: [productDetail],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });
orderSchema.plugin(mongooseLeanVirtuals);

const Order = model("order", orderSchema);
module.exports = Order;

// orderSchema.virtual("product", {
//   ref: "product",
//   localField: "productId",
//   foreignField: "_id",
//   justOne: true,
// });

// const orderSchema = new Schema(
//   {
//     createDate: {
//       type: Date,
//       default: Date.now,
//     },

//     shippedDate: {
//       type: Date,
//       // required: [true, "shippedDate không được bỏ trống"],
//       validate: {
//         validator: function (value) {
//           if (value < this.createDate) return false;
//         },
//         messages: "shippedDate được không nhỏ hơn createDate",
//       },
//     },

//     status: {
//       type: String,
//       required: [true, "Trạng thái đơn hàng không được bỏ trống"],
//       default: "WAITING",
//       validate: {
//         validator: function (value) {
//           if (!value) return false;
//           if (["WAITING", "COMPLETED", "CANCEL"].includes(value.toUpperCase()))
//             return true;
//           return false;
//         },
//         message: "Trạng thái đơn hàng bị lỗi",
//       },
//     },

//     description: {
//       type: String,
//       max: [500, "Mô tả đơn hàng không được lớn hơn 500 kí tự"],
//     },

//     paymentType: {
//       type: String,
//       required: [true, "Hình thức thanh toán đơn hàng không được bỏ trống"],
//       validate: {
//         validator: function (value) {
//           if (["CASH", "CREDIT CARD"].includes(value.toUpperCase()))
//             return true;
//           return false;
//         },
//       },
//       default: "CASH",
//       message: "Hình thức thanh toán đơn hàng bị lỗi",
//     },

//     customerId: {
//       type: Schema.Types.ObjectId,
//       ref: "customer",
//       required: [true, "customerId không được bỏ trống"],
//     },

//     employeeId: {
//       type: Schema.Types.ObjectId,
//       ref: "employee",
//       required: [true, "employeeId không được bỏ trống"],
//     },

//     orderDetails: [orderDetailSchema],
//   },
//   {
//     timestamps: true,
//     versionKey: false,
//   }
// );

// orderSchema.virtual("employee", {
//   ref: "employee",
//   localField: "employeeId",
//   foreignField: "_id",
//   justOne: true,
// });

// orderSchema.virtual("customer", {
//   ref: "customer",
//   localField: "customerId",
//   foreignField: "_id",
//   justOne: true,
// });

// orderSchema.set("toJSON", { virtuals: true });
// orderSchema.set("toObject", { virtuals: true });
//
