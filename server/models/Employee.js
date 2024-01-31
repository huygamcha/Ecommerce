const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const employeeSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Tên nhân viên không được bỏ trống"],
      maxLength: [50, "Tên nhân viên không được vượt quá 50 ký tự"],
    },
    lastName: {
      type: String,
      required: [true, "Họ nhân viên không được bỏ trống"],
      maxLength: [50, "Họ nhân viênkhông được vượt quá 50 ký tự"],
    },
    phoneNumber: {
      type: String,
      maxLength: [50, "Số điện thoại nhân viên không được vượt quá 50 ký tự"],
      validate: {
        validator: function (value) {
          const phoneRegex =
            /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
          return phoneRegex.test(value);
        },
        message: `{VALUE} không phải là số điện thoại hợp lệ`,
        // message: (props) => `{props.value} is not a valid email!`,
      },
    },
    address: {
      type: String,
      required: [true, "Địa chỉ nhân viên không được bỏ trống"],
      maxLength: [500, "Địa chỉ nhân viên không được vượt quá 500 ký tự"],
      unique: [true, "Địa chỉ nhân viên không được trùng"],
    },
    email: {
      type: String,
      validate: {
        validator: function (value) {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        },
        message: `{VALUE} sai định dạng email!`,
        // message: (props) => `{props.value} is not a valid email!`,
      },
      required: [true, "Email nhân viên không được bỏ trống"],
      maxLength: [50, "Email nhân viên không được vượt quá 50 ký tự"],
      unique: [true, "Email nhân viên không được trùng"],
    },
    birthday: { type: Date },
    password: {
      type: String,
      required: true,
      minLength: [3, "Mật khẩu nhân viên không được ít hơn 3 ký tự"],
      maxLength: [12, "Mật khẩu nhân viên không được vượt quá 12 ký tự"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

employeeSchema.virtual("fullName", function () {
  return `${this.firstName} ${this.lastName}}`;
});

const Employee = model("employee", employeeSchema);
module.exports = Employee;
