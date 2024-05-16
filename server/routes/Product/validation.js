const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;

const checkCreateProduct = yup.object({
  body: yup.object({
    name: yup
      .string()
      .test({
        name: "required",
        message: "Tên sản phẩm không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      })
      .min(2, "Tên sản phẩm không được nhỏ hơn 2 kí tự"),

    price: yup
      .number()
      .min(0, "Giá sản phẩm không được âm")
      .integer()
      .test({
        name: "required",
        message: "Giá sản phẩm không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      }),

    stock: yup
      .number()
      .min(0, "Số lượng sản phẩm không được âm")
      .integer()
      .test({
        name: "required",
        message: "Số lượng sản phẩm không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      }),
    discount: yup
      .number()
      .max(75, "Giảm giá sản phẩm không được lớn hơn 75")
      .min(0, "Giảm giá sản phẩm không được âm")
      .test({
        name: "required",
        message: "Giảm giá sản phẩm không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      }),

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
      ),
    // .test({
    //   name: "required",
    //   message: "SupplierId không được bỏ trống",
    //   test: (value) => value !== undefined && value !== null && value !== "",
    // }),

    brandId: yup
      .string()
      .test("Validate ObjectID", "BrandId không phải là id hợp lệ", (value) => {
        if (value !== undefined && value !== null && value !== "") {
          return ObjectId.isValid(value);
        }
        return true;
      })
      .test({
        name: "required",
        message: "BrandId không được bỏ trống",
        test: (value) => value !== undefined && value !== null && value !== "",
      }),
    //future
    // tagList: yup
    //   .array()
    //   .of(yup.string())
    //   .test("valid value", (value, { createError }) => {
    //     const errorsTagList = {};
    //     for (let i = 0; i < value.length; i++) {
    //       if (!ObjectId.isValid(value[i])) {
    //         errorsTagList[`tagId thứ ${i + 1}`] = "không phải là id hợp lệ";
    //       }
    //     }
    //     if (Object.keys(errorsTagList).length > 0) {
    //       console.log("««««« kok »»»»»", errorsTagList);
    //       return errorsTagList;
    //     }
    //     return true;
    //   }),

    description: yup.string(),
    slug: yup.string(),
    age: yup.number(),
  }),
});

const checkUpdateProduct = yup.object({
  body: yup.object({
    name: yup
      .string()
      .max(50, "Tên sản phẩm không được dài hơn 50 kí tự")
      .min(2, "Tên sản phẩm không được nhỏ hơn 2 kí tự"),

    price: yup.number().min(0, "Giá sản phẩm không được âm").integer(),

    stock: yup
      .number()
      .min(0, "Số lượng sản phẩm không được âm")
      .integer()
      .max(500, "Số lượng sản phẩm không được nhiều hơn 500 "),

    discount: yup
      .number()
      .max(75, "Giảm giá sản phẩm không được lớn hơn 75")
      .min(0, "Giảm giá sản phẩm không được âm"),

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
      ),

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
      ),

    // tagList: yup.array().of(
    //   yup.object().shape({
    //     tagId: yup.string().test(
    //       "object valid",
    //       ({ path }) =>
    //         `tagId thứ ${
    //           parseInt(path.split(".")[1].split("[")[1].split("]")[0]) + 1
    //         } không phải là id hợp lệ`,
    //       (value) => {
    //         if (value !== null && value !== "" && value !== undefined) {
    //           return ObjectId.isValid(value);
    //         }
    //         return true;
    //       }
    //     ),
    //   })
    // ),
    brandId: yup
      .string()
      .test("Validate ObjectID", "BrandId không phải là id hợp lệ", (value) => {
        if (value !== undefined && value !== null && value !== "") {
          return ObjectId.isValid(value);
        }
        return true;
      }),

    description: yup.string(),
    slug: yup.string(),
    age: yup.number(),
  }),
});

module.exports = {
  checkCreateProduct,
  checkUpdateProduct,
};
