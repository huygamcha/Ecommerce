const ObjectId = require("mongodb").ObjectId;
const yup = require("yup");
const slugify = require("slugify");

const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params,
      },
      {
        abortEarly: false,
      }
    );
    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ type: err.name, message: err.errors, provider: "yup" });
  }
};

const checkId = yup.object({
  params: yup.object({
    id: yup
      .string()
      .test("Validate ObjectID", "Không phải là id hợp lệ", (value) => {
        return ObjectId.isValid(value);
      }),
  }),
});

const checkIdQuery = yup.object({
  query: yup.object({
    id: yup
      .string()
      .test("Validate ObjectID", "Không phải là id hợp lệ", (value) => {
        return ObjectId.isValid(value);
      }),
  }),
});

const fuzzySearch = (text) => {
  text = slugify(text, { lower: true, locate: "vi" });
  const regex = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  return new RegExp(regex, "gi");
};

// tạo bất đồng bộ để kiểm tra từng phần tử

const asyncForEach = async (array, callback) => {
  // console.log("««««« array »»»»»", array);
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array);
  }
};

module.exports = {
  validateSchema,
  checkId,
  fuzzySearch,
  checkIdQuery,
  asyncForEach,
};
