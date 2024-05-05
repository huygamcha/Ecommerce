const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;

const checkCreateLocation = yup.object({
  body: yup.object({
    name: yup.string().test({
      name: "required",
      message: "Tên cửa hàng không được bỏ trống",
      test: (value) => value !== undefined && value !== null && value !== "",
    }),
    time: yup.string().test({
      name: "required",
      message: "Thời gian không được bỏ trống",
      test: (value) => value !== undefined && value !== null && value !== "",
    }),
    address: yup.string().test({
      name: "required",
      message: "Địa chỉ không được bỏ trống",
      test: (value) => value !== undefined && value !== null && value !== "",
    }),
    map: yup.string().test({
      name: "required",
      message: "Chỉ đường không được bỏ trống",
      test: (value) => value !== undefined && value !== null && value !== "",
    }),
  }),
});

const checkUpdateLocation = yup.object({
  body: yup.object({
    time: yup.string(),
    address: yup.string(),
    map: yup.string(),
  }),
});

module.exports = {
  checkCreateLocation,
  checkUpdateLocation,
};
