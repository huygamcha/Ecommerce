const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;

const checkCreateOrder = yup.object().shape({
  body: yup.object({
    createdDate: yup.date(),
    status: yup
      .string()
      .max("50", "Trạng thái mã đơn hàng không dược vượt quá 50 kí tự")
      // future: update
      .test("check value", "Trạng thái mã đơn hàng không hợp lệ", (value) => {
        if (value !== undefined && value !== null && value !== "") {
          return (
            value.toUpperCase() === "WAITING" ||
            value.toUpperCase() === "COMPLETED" ||
            value.toUpperCase() === "CANCEL"
          );
        }
        return true;
      })
      .test(
        "required",
        "Trạng thái mã đơn hàng không được bỏ trống",
        (value) => {
          return value !== undefined && value !== null && value !== "";
        }
      ),

    description: yup.string().max(500, "Mô tả đơn hàng không quá 500 dòng"),

    paymentType: yup
      .string()
      .max("50", "Kiểu thanh toán đơn hàng không dược vượt quá 50 kí tự")
      // future: update
      .test("check value", "Kiểu thanh toán đơn hàng không hợp lệ", (value) => {
        if (value !== undefined && value !== null && value !== "") {
          return (
            value.toUpperCase() === "CASH" ||
            value.toUpperCase() === "CREDIT CARD"
          );
        }
        return true;
      })
      .test(
        "required",
        "Kiểu thanh toán đơn hàng không được bỏ trống",
        (value) => {
          return value !== undefined && value !== null && value !== "";
        }
      ),

    customerId: yup
      .string()
      .test({
        name: "required",
        message: "customerId không được bỏ trống",
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

    employeeId: yup
      .string()
      .test({
        name: "required",
        message: "employeeId không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .test(
        "Validate ObjectID",
        "employeeId không phải là id hợp lệ",
        (value) => {
          if (value !== undefined && value !== null && value !== "") {
            return ObjectId.isValid(value);
          }
          return true;
        }
      ),
    // future: update(dùng để đánh dấu đã nhận hàng hay chưa)
    shippedDate: yup
      .date()
      // .test("required", "shippedDate không được bỏ trống", (value) => {
      //   return value !== undefined && value !== null && value !== "";
      // })
      .test(
        "check date",
        "shippedDate không được nhỏ hơn ngày tạo",
        (value, context) => {
          if (value !== undefined && value !== null && value !== "") {
            return context.parent.createdDate <= value;
          }
          return true;
        }
      ),

    orderDetails: yup.array().of(
      yup.object().shape({
        productId: yup
          .string()
          .test(
            "object valid",
            ({ path }) =>
              `productId thứ ${
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
              `productId thứ ${
                parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
              } không được bỏ trống`,
            (value) => value !== null && value !== "" && value !== undefined
          ),

        quantity: yup
          .number()
          .test(
            "required",
            ({ path }) =>
              `số lượng của sản phẩm thứ ${
                parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
              } không được bỏ trống`,
            (value) => value !== null && value !== "" && value !== undefined
          )
          .min(
            0,
            ({ path }) =>
              `số lượng của sản phẩm thứ ${
                parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
              } không được âm`
          ),

        price: yup
          .number()
          .test(
            "required",
            ({ path }) =>
              `giá của sản phẩm thứ ${
                parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
              } không được bỏ trống`,
            (value) => value !== null && value !== "" && value !== undefined
          )
          .min(
            0,
            ({ path }) =>
              `giá của sản phẩm thứ ${
                parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
              } không được âm`
          ),

        discount: yup
          .number()
          .test(
            "required",
            ({ path }) =>
              `phần trăm giảm giá của sản phẩm thứ ${
                parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
              } không được bỏ trống`,
            (value) => value !== null && value !== "" && value !== undefined
          )
          .min(
            0,
            ({ path }) =>
              `phần trăm giảm giá của sản phẩm thứ ${
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
      })
    ),
  }),
});

const checkUpdateOrder = yup.object({
  body: yup.object({
    name: yup
      .string()
      .max(50, "Họ đơn hàng không được dài hơn 50 kí tự")
      .min(2, "Họ đơn hàng không được nhỏ hơn 2 kí tự"),

    price: yup.number().min(0, "Giá đơn hàng không được âm").integer(),

    stock: yup
      .number()
      .min(0, "Số lượng đơn hàng không được âm")
      .integer()
      .max(500, "Số lượng đơn hàng không được nhiều hơn 500 "),

    discount: yup
      .number()
      .max(75, "Giảm giá đơn hàng không được lớn hơn 75")
      .min(0, "Giảm giá đơn hàng không được âm"),

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

    supplierId: yup
      .string()
      .test(
        "Validate ObjectID",
        "SupplierId không phải là id hợp lệ",
        (value) => {
          if (value !== undefined && value !== null && value !== "") {
            return ObjectId.isValid(value);
          }
          return true;
        }
      )
      .test({
        name: "required",
        message: "SupplierId không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      }),

    description: yup.string(),
  }),
});

module.exports = {
  checkCreateOrder,
  checkUpdateOrder,
};
