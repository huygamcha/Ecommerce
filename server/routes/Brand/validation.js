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
    description: yup
      .string()
      .max(500, "Mô tả thương hiệu không được lớn hơn 500 kí tự"),
  }),
});

const checkUpdateBrand = yup.object({
  body: yup.object({
    name: yup
      .string()
      .max(50, "Tên thương hiệu không được dài hơn 50 kí tự")
      .min(2, "Tên thương hiệu không được nhỏ hơn 2 kí tự"),
    description: yup
      .string()
      .max(500, "Mô tả thương hiệu không được lớn hơn 500 kí tự"),
  }),
});

module.exports = {
  checkCreateBrand,
  checkUpdateBrand,
};
