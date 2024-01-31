const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const supplierSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "Tên nhà cung cấp không được bỏ trống"],
      maxLength: [100, "Tên nhà cung cấp không được vượt quá 100 kí tự"],
    },
    email: {
      type: String,
      require: [true, "Email nhà cung cấp không được bỏ trống"],
      maxLength: [50, "Email nhà cung cấp không được vượt quá 50 kí tự"],
      unique: [true, "Email nhà cung cấp không được trùng"],
      validate: {
        validator: function (value) {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        },
        message: `{VALUE} không phải là email hợp lệ!`,
        // message: (props) => `{props.value} is not a valid email!`,
      },
    },
    phoneNumber: {
      type: String,
      require: [true, "Email nhà cung cấp không được bỏ trống"],
      maxLength: [51, "Email nhà cung cấp không được vượt quá 50 kí tự"],
      unique: [true, "Email nhà cung cấp không được trùng"],
      validate: {
        validator: function (value) {
          const phoneNumberRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
          return phoneNumberRegex.test(value);
        },
        message: `{VALUE} không phải là phone number hợp lệ!`,
        // message: (props) => `{props.value} is not a valid email!`,
      },
    },
    address: {
      type: String,
      maxLength: [500, "Địa chỉ nhà cung cấp không được vượt quá 500 ký tự"],
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

const Supplier = model("supplier", supplierSchema);
module.exports = Supplier;
