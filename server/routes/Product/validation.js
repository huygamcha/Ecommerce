const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;

const checkCreateProduct = yup.object({
  body: yup.object({
    name: yup
      .string()
      .test({
        name: "required",
        message: "Họ sản phẩm không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .max(50, "Họ sản phẩm không được dài hơn 50 kí tự")
      .min(2, "Họ sản phẩm không được nhỏ hơn 2 kí tự"),

    price: yup
      .number()
      .min(0, "Giá sản phẩm không được âm ")
      .integer()
      .test({
        name: "required",
        message: "Giá sản phẩm không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      }),

    stock: yup
      .number()
      .min(0, "Số lượng sản phẩm không được âm")
      .integer()
      .test({
        name: "required",
        message: "Số lượng sản phẩm không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .max(500, "Số lượng sản phẩm không được dài hơn 500 kí tự"),

    discount: yup
      .number()
      .min(0, "Giảm giá sản phẩm không được âm")
      .max(75, "Giảm giá sản phẩm không được lớn hơn 75%")
      .integer()
      .test({
        name: "required",
        message: "Giảm giá sản phẩm không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .max(500, "Số lượng sản phẩm không được dài hơn 500 kí tự"),

    categoryId: yup
      .string()
      .test(
        "Validate ObjectID",
        "CategoryId không phải là id hợp lệ",
        (value) => {
          return ObjectId.isValid(value);
        }
      ),

    supplierId: yup
      .string()
      .test(
        "Validate ObjectID",
        "SupplierId không phải là id hợp lệ",
        (value) => {
          return ObjectId.isValid(value);
        }
      ),

    description: yup.string(),
  }),
});

const checkUpdateProduct = yup.object({
  body: yup.object({
    firstName: yup
      .string()
      .max(50, "Họ sản phẩm không được dài hơn 50 kí tự")
      .min(2, "Họ sản phẩm không được nhỏ hơn 2 kí tự"),

    lastName: yup
      .string()
      .max(50, "Tên sản phẩm không được dài hơn 50 kí tự")
      .min(2, "Tên sản phẩm không được nhỏ hơn 2 kí tự"),

    password: yup
      .string()
      .max(50, "Mật khẩu không được dài hơn 50 kí tự")
      .min(6, "Mật khẩu không được nhỏ hơn 6 kí tự"),

    email: yup
      .string()
      .max(50, "Email sản phẩm không được dài hơn 50 kí tự")
      .min(2, "Email sản phẩm không được nhỏ hơn 2 kí tự")
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
      .max(500, "Địa chỉ sản phẩm không được dài hơn 500 kí tự"),
    birthday: yup.date(),
  }),
});

module.exports = {
  checkCreateProduct,
  checkUpdateProduct,
};
