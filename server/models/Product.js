const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const productSchema = new Schema({
  name: {
    type: String,
    require: [true, "Tên sản phẩm không được bỏ trống"],
    maxLength: [50, "Tên sản phẩm không được quá 50 kí tự"],
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
    max: [75, "Phần trăm giảm giá sản phẩm không được nhỏ hơn 76%"],
  },

  stock: {
    type: Number,
    require: [true, "Số lượng sản phẩm không được bỏ trống"],
    default: 0,
    min: [0, "Số lượng sản phẩm không được âm"],
  },

  description: {
    type: String,
    require: [true, "Mô tả sản phẩm không được bỏ trống"],
    maxLength: [3000, "Mô tả sản phẩm không được quá 3000 kí tự"],
  },

  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },

  supplierId: {
    type: Schema.Types.ObjectId,
    ref: "supplier",
    required: true,
  },
});

productSchema.virtual("category", {
  ref: "category",
  localFields: "categoryId",
  foreignFields: "_id",
  justOne: true,
});

productSchema.virtual("supplier", {
  ref: "supplier",
  localFields: "supplierId",
  foreignFields: "_id",
  justOne: true,
});

productSchema.virtual("total", function () {
  return this.price * ((100 - this.discount) / 100);
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });
//
productSchema.plugin(mongooseLeanVirtuals);

const Product = model("product", productSchema);
module.exports = Product;
