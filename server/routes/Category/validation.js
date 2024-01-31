const yup = require("yup");

const checkCreateCategory = yup.object({
  body: yup.object({
    name: yup
      .string()
      .test({
        name: "required",
        message: "Tên danh mục không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .max(50, "Tên danh mục không được dài hơn 50 kí tự")
      .min(2, "Tên danh mục không được nhỏ hơn 2 kí tự")
      .required(),
    description: yup
      .string()
      .max(500, "Mô tả danh mục không được lớn hơn 500 kí tự"),
  }),
});

const checkUpdateCategory = yup.object({
  body: yup.object({
    name: yup
      .string()
      .max(50, "Tên danh mục không được dài hơn 50 kí tự")
      .min(2, "Tên danh mục không được nhỏ hơn 2 kí tự"),
    description: yup
      .string()
      .max(500, "Mô tả danh mục không được lớn hơn 500 kí tự"),
  }),
});

module.exports = {
  checkCreateCategory,
  checkUpdateCategory,
};
