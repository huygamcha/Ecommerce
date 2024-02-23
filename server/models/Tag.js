const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên tag không được bỏ trống"],
      maxLength: [50, "Tên tag không được vượt quá 50 kí tự"],
      unique: [true, "Tên tag không được trùng"],
    },
    description: {
      type: String,
      maxLength: [500, "Mô tả tag không được vượt quá 500 kí tự"],
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

const Tag = model("tag", tagSchema);
module.exports = Tag;
