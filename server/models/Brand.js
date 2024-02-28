const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const brandSchema = new Schema(
  {
    CategoryId: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Tên thương hiệu không được bỏ trống"],
    },
    name: {
      type: String,
      required: [true, "Tên thương hiệu không được bỏ trống"],
      maxLength: [50, "Tên thương hiệu không được vượt quá 50 kí tự"],
      unique: [true, "Tên thương hiệu không được trùng"],
    },
    description: {
      type: String,
      maxLength: [500, "Mô tả thương hiệu không được vượt quá 500 kí tự"],
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Brand = model("brand", brandSchema);
module.exports = Brand;
