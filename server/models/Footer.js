const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const footerSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên footer không được bỏ trống"],
      maxLength: [50, "Tên footer không được vượt quá 50 kí tự"],
      unique: [true, "Tên footer không được trùng"],
    },
    column: {
      type: Number,
      required: [true, "Số cột không được bỏ trống"],
    },
    url: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Footer = model("footer", footerSchema);
module.exports = Footer;
