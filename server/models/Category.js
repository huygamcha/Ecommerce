const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên danh mục không được bỏ trống"],
      maxLength: [50, "Tên danh mục không được vượt quá 50 kí tự"],
      unique: [true, "Tên danh mục không được trùng"],
    },
    description: {
      type: String,
      maxLength: [500, "Mô tả danh mục không được vượt quá 500 kí tự"],
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

const Category = model("category", categorySchema);
module.exports = Category;
