const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;

const checkCreateCart = yup.object().shape({
  body: yup.object({
    userId: yup
      .string()
      .test({
        name: "required",
        message: "userId không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .test(
        "Validate ObjectID",
        "customerId không phải là id hợp lệ",
        (value) => {
          if (value !== undefined && value !== null && value !== "") {
            return ObjectId.isValid(value);
          }
          return true;
        }
      ),

    cartList: yup.array().of(
      yup.object().shape({
        id: yup
          .string()
          .test(
            "object valid",
            ({ path }) =>
              `Id sản phẩm thứ ${
                parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
              } không phải là id hợp lệ`,
            (value) => {
              if (value !== null && value !== "" && value !== undefined) {
                return ObjectId.isValid(value);
              }
              return true;
            }
          )
          .test(
            "required",
            ({ path }) =>
              `Id của sản phẩm thứ ${
                parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
              } không được bỏ trống`,
            (value) => value !== null && value !== "" && value !== undefined
          ),

        name: yup
          .string()
          .test(
            "required",
            ({ path }) =>
              `Tên của sản phẩm thứ ${
                parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
              } không được bỏ trống`,
            (value) => value !== null && value !== "" && value !== undefined
          )
          .max(50, "Tên sản phẩm không được dài hơn 50 kí tự")
          .min(2, "Tên sản phẩm không được nhỏ hơn 2 kí tự"),

        pic: yup.string(),

        quantity: yup
          .number()
          .test(
            "required",
            ({ path }) =>
              `Số lượng của sản phẩm thứ ${
                parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
              } không được bỏ trống`,
            (value) => value !== null && value !== "" && value !== undefined
          )
          .min(
            0,
            ({ path }) =>
              `Số lượng của sản phẩm thứ ${
                parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
              } không được âm`
          ),

        price: yup
          .number()
          .test(
            "required",
            ({ path }) =>
              `Giá của sản phẩm thứ ${
                parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
              } không được bỏ trống`,
            (value) => value !== null && value !== "" && value !== undefined
          )
          .min(
            0,
            ({ path }) =>
              `Giá của sản phẩm thứ ${
                parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
              } không được âm`
          ),

        discount: yup
          .number()
          .test(
            "required",
            ({ path }) =>
              `Phần trăm giảm giá của sản phẩm thứ ${
                parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
              } không được bỏ trống`,
            (value) => value !== null && value !== "" && value !== undefined
          )
          .min(
            0,
            ({ path }) =>
              `Phần trăm giảm giá của sản phẩm thứ ${
                parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
              } không được âm`
          )
          .max(
            75,
            ({ path }) =>
              `phần trăm giảm giá của sản phẩm thứ ${
                parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
              } không được lớn hơn 75%`
          ),

        stock: yup
          .number()
          .test(
            "required",
            ({ path }) =>
              `Số lượng của sản phẩm thứ ${
                parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
              } không được bỏ trống`,
            (value) => value !== null && value !== "" && value !== undefined
          )
          .min(
            0,
            ({ path }) =>
              `Số lượng của sản phẩm thứ ${
                parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
              } không được âm`
          ),

        total: yup
          .number()
          .test(
            "required",
            ({ path }) =>
              `Tổng số tiền của sản phẩm thứ ${
                parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
              } không được bỏ trống`,
            (value) => value !== null && value !== "" && value !== undefined
          )
          .min(
            0,
            ({ path }) =>
              `Tổng số tiền của sản phẩm thứ ${
                parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
              } không được âm`
          ),
      })
    ),
  }),
});
module.exports = {
  checkCreateCart,
};
