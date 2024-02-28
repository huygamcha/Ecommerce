const yup = require("yup");

const checkCreateBrand = yup.object({
  body: yup.object({
    name: yup
      .string()
      .test({
        name: "required",
        message: "Tên thương hiệu không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .max(50, "Tên thương hiệu không được dài hơn 50 kí tự")
      .min(2, "Tên thương hiệu không được nhỏ hơn 2 kí tự"),
    categoryId: yup
      .string()
      .test(
        "Validate ObjectID",
        "CategoryId không phải là id hợp lệ",
        (value) => {
          if (value !== undefined && value !== null && value !== "") {
            return ObjectId.isValid(value);
          }
          return true;
        }
      )
      .test({
        name: "required",
        message: "CategoryId không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      }),
  }),
});

const checkUpdateBrand = yup.object({
  body: yup.object({
    name: yup
      .string()
      .max(50, "Tên thương hiệu không được dài hơn 50 kí tự")
      .min(2, "Tên thương hiệu không được nhỏ hơn 2 kí tự"),
    categoryId: yup
      .string()
      .test(
        "Validate ObjectID",
        "CategoryId không phải là id hợp lệ",
        (value) => {
          if (value !== undefined && value !== null && value !== "") {
            return ObjectId.isValid(value);
          }
          return true;
        }
      )
      .test({
        name: "required",
        message: "CategoryId không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      }),
  }),
});

module.exports = {
  checkCreateBrand,
  checkUpdateBrand,
};
