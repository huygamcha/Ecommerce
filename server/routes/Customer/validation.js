const yup = require("yup");

const checkCreateCustomer = yup.object({
  body: yup.object({
    firstName: yup
      .string()
      .test({
        name: "required",
        message: "Tên khách hàng không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .max(50, "Tên khách hàng không được dài hơn 50 kí tự")
      .min(2, "Tên khách hàng không được nhỏ hơn 2 kí tự"),

    lastName: yup
      .string()
      .test({
        name: "required",
        message: "Họ khách hàng không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .max(50, "Họ khách hàng không được dài hơn 50 kí tự")
      .min(2, "Họ khách hàng không được nhỏ hơn 2 kí tự"),

    password: yup
      .string()
      .test({
        name: "required",
        message: "Mật khẩu không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .max(50, "Mật khẩu không được dài hơn 50 kí tự")
      .min(6, "Mật khẩu không được nhỏ hơn 6 kí tự"),

    email: yup
      .string()
      .test({
        name: "required",
        message: "Email khách hàng không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .max(50, "Email khách hàng không được dài hơn 50 kí tự")
      .min(2, "Email khách hàng không được nhỏ hơn 2 kí tự")
      .test("email type", "Không phải là email hợp lệ", (value) => {
        if (value !== undefined && value !== null && value !== "") {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        }
        return true;
      }),

    phoneNumber: yup
      .string()
      .test({
        name: "required",
        message: "Số điện thoại khách hàng không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .test(
        "phoneNumber type",
        "Số điện thoại khách hàng không hợp lệ",
        (value) => {
          if (value !== undefined && value !== null && value !== "") {
            const phoneRegex =
              /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
            return phoneRegex.test(value);
          }
          return true;
        }
      ),

    address: yup
      .string()
      .test({
        name: "required",
        message: "Địa chỉ khách hàng không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .max(500, "Địa chỉ khách hàng không được dài hơn 500 kí tự"),
    birthday: yup.date(),
  }),
});

const checkUpdateCustomer = yup.object({
  body: yup.object({
    firstName: yup
      .string()
      .max(50, "Họ khách hàng không được dài hơn 50 kí tự")
      .min(2, "Họ khách hàng không được nhỏ hơn 2 kí tự"),

    lastName: yup
      .string()
      .max(50, "Tên khách hàng không được dài hơn 50 kí tự")
      .min(2, "Tên khách hàng không được nhỏ hơn 2 kí tự"),

    password: yup
      .string()
      .max(50, "Mật khẩu không được dài hơn 50 kí tự")
      .min(6, "Mật khẩu không được nhỏ hơn 6 kí tự"),

    email: yup
      .string()
      .max(50, "Email khách hàng không được dài hơn 50 kí tự")
      .min(2, "Email khách hàng không được nhỏ hơn 2 kí tự")
      .test("email type", "Không phải là email hợp lệ", (value) => {
        if (value !== undefined && value !== null && value !== "") {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        }
        return true;
      }),

    phoneNumber: yup
      .string()
      .test("phoneNumber type", "Số điện thoại không hợp lệ", (value) => {
        if (value !== undefined && value !== null && value !== "") {
          const phoneRegex =
            /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
          return phoneRegex.test(value);
        }
        return true;
      }),

    address: yup
      .string()
      .max(500, "Địa chỉ khách hàng không được dài hơn 500 kí tự"),
    birthday: yup.date(),
  }),
});

module.exports = {
  checkCreateCustomer,
  checkUpdateCustomer,
};
