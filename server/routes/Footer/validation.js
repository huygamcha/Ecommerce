const yup = require("yup");

const checkCreateFooter = yup.object({
  body: yup.object({
    name: yup
      .string()
      .test({
        name: "required",
        message: "Tên footer không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .max(50, "Tên footer không được dài hơn 50 kí tự")
      .min(2, "Tên footer không được nhỏ hơn 2 kí tự"),
    url: yup.string().min(2, "Tên url footer không được nhỏ hơn 2 kí tự"),
    column: yup.number(),
  }),
});

const checkUpdateFooter = yup.object({
  body: yup.object({
    name: yup
      .string()
      .max(50, "Tên footer không được dài hơn 50 kí tự")
      .min(2, "Tên footer không được nhỏ hơn 2 kí tự"),
    url: yup.string().max(500, "Mô tả footer không được lớn hơn 500 kí tự"),
    column: yup.number(),
  }),
});

module.exports = {
  checkCreateFooter,
  checkUpdateFooter,
};
