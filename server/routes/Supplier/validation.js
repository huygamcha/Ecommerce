const yup = require("yup");

const checkCreateSupplier = yup.object({
  body: yup.object({
    name: yup
      .string()
      .test({
        name: "required",
        message: "Tên nhà cung cấp không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .max(50, "Tên nhà cung cấp không được dài hơn 50 kí tự")
      .min(2, "Tên nhà cung cấp không được nhỏ hơn 2 kí tự"),

    email: yup
      .string()
      .test({
        name: "required",
        message: "Email nhà cung cấp không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .max(50, "Email nhà cung cấp không được dài hơn 50 kí tự")
      .min(2, "Email nhà cung cấp không được nhỏ hơn 2 kí tự")
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
        message: "Số điện thoại nhà cung cấp không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
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
      .test({
        name: "required",
        message: "Địa chỉ nhà cung cấp không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .test({
        name: "required",
        message: "Địa chỉ nhà cung cấp không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .max(500, "Địa chỉ nhà cung cấp không được dài hơn 500 kí tự"),
  }),
});

const checkUpdateSupplier = yup.object({
  body: yup.object({
    name: yup
      .string()
      .max(50, "Tên nhà cung cấp không được dài hơn 50 kí tự")
      .min(2, "Tên nhà cung cấp không được nhỏ hơn 2 kí tự"),

    email: yup
      .string()
      .max(50, "Email nhà cung cấp không được dài hơn 50 kí tự")
      .min(2, "Email nhà cung cấp không được nhỏ hơn 2 kí tự")
      .test("email type", "Không phải là email hợp lệ", (value) => {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(value);
      }),

    phoneNumber: yup
      .string()
      .test("phoneNumber type", "Số điện thoại không hợp lệ", (value) => {
        const phoneRegex =
          /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
        return phoneRegex.test(value);
      }),

    address: yup
      .string()
      .test({
        name: "required",
        message: "Địa chỉ nhà cung cấp không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .max(500, "Địa chỉ nhà cung cấp không được dài hơn 500 kí tự"),
  }),
});

module.exports = {
  checkCreateSupplier,
  checkUpdateSupplier,
};
