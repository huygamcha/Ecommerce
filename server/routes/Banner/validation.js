const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;

const checkCreateBanner = yup.object({
  body: yup.object({
    pic: yup.string().test({
      name: "required",
      message: "Ảnh banner không được bỏ trống",
      test: (value) => value !== undefined && value !== null && value !== "",
    }),
  }),
});

const checkUpdateBanner = yup.object({
  body: yup.object({
    pic: yup.string().test({
      name: "required",
      message: "Ảnh banner không được bỏ trống",
      test: (value) => value !== undefined && value !== null && value !== "",
    }),
  }),
});

module.exports = {
  checkCreateBanner,
  checkUpdateBanner,
};
