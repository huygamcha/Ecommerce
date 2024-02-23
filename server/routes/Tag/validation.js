const yup = require("yup");

const checkCreateTag = yup.object({
  body: yup.object({
    name: yup
      .string()
      .test({
        name: "required",
        message: "Tên tag không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .max(50, "Tên tag không được dài hơn 50 kí tự")
      .min(2, "Tên tag không được nhỏ hơn 2 kí tự"),
  }),
});

const checkUpdateTag = yup.object({
  body: yup.object({
    name: yup
      .string()
      .max(50, "Tên tag không được dài hơn 50 kí tự")
      .min(2, "Tên tag không được nhỏ hơn 2 kí tự"),
  }),
});

module.exports = {
  checkCreateTag,
  checkUpdateTag,
};
