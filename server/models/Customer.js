const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const customerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Tên khách hàng không được bỏ trống"],
      maxLength: [50, "Tên khách hàng không được vượt quá 50 ký tự"],
    },
    lastName: {
      type: String,
      required: [true, "Họ khách hàng không được bỏ trống"],
      maxLength: [50, "Họ khách hàngkhông được vượt quá 50 ký tự"],
    },
    phoneNumber: {
      type: String,
      maxLength: [50, "Số điện thoại khách hàng không được vượt quá 50 ký tự"],
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
      required: [true, "Tên khách hàng không được bỏ trống"],
      maxLength: [50, "Tên khách hàng không được vượt quá 50 ký tự"],
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
      required: [true, "Email khách hàng không được bỏ trống"],
      maxLength: [50, "Email khách hàng không được vượt quá 50 ký tự"],
      unique: [true, "Email khách hàng không được trùng"],
    },
    birthday: { type: Date },
    password: {
      type: String,
      required: true,
      minLength: [3, "Mật khẩu khách hàng không được ít hơn 3 ký tự"],
      maxLength: [12, "Mật khẩu khách hàng không được vượt quá 12 ký tự"],
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

customerSchema.pre("save", async function (next) {
  try {
    // generate salt key
    const salt = await bcrypt.genSalt(10); // 10 ký tự ABCDEFGHIK + 123456
    // generate password = salt key + hash key
    const hashPass = await bcrypt.hash(this.password, salt);
    // override password
    this.password = hashPass;

    next();
  } catch (err) {
    next(err);
  }
});

customerSchema.methods.isValidPass = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

customerSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

customerSchema.set("toJSON", { virtuals: true });
customerSchema.set("toObject", { virtuals: true });
//
customerSchema.plugin(mongooseLeanVirtuals);

const Customer = model("customer", customerSchema);
module.exports = Customer;
