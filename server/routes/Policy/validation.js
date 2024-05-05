const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;

const checkCreatePolicy = yup.object({
  body: yup.object({
    name: yup.string().test({
      name: "required",
      message: "Tên chính sách không được bỏ trống",
      test: (value) => value !== undefined && value !== null && value !== "",
    }),
    slug: yup.string(),
    content: yup.string(),
  }),
});

const checkUpdatePolicy = yup.object({
  body: yup.object({
    name: yup.string(),
    content: yup.string(),
  }),
});

module.exports = {
  checkCreatePolicy,
  checkUpdatePolicy,
};
