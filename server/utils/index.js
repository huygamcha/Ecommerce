const ObjectId = require("mongodb").ObjectId;
const yup = require("yup");

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

module.exports = { validateSchema, checkId };
