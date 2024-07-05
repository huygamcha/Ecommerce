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
      .min(2, "Tên danh mục không được nhỏ hơn 2 kí tự"),
    no: yup.number(),
  }),
});

const checkUpdateCategory = yup.object({
  body: yup.object({
    name: yup
      .string()
      .max(50, "Tên danh mục không được dài hơn 50 kí tự")
      .min(2, "Tên danh mục không được nhỏ hơn 2 kí tự"),
    no: yup.number(),
  }),
});

module.exports = {
  checkCreateCategory,
  checkUpdateCategory,
};
