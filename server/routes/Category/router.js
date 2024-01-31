var express = require("express");
const {
  getAllCategory,
  createCategory,
  deleteCategory,
  getDetailCategory,
  updateCategory,
} = require("./controller");
const { checkCreateCategory, checkUpdateCategory } = require("./validation");
const { checkId, validateSchema } = require("../../utils");
var router = express.Router();

router.route("/").get(getAllCategory);
router.route("/").post(validateSchema(checkCreateCategory), createCategory);
router
  .route("/:id")
  .delete(validateSchema(checkId), deleteCategory)
  .get(validateSchema(checkId), getDetailCategory)
  .patch(
    validateSchema(checkId),
    validateSchema(checkUpdateCategory),
    updateCategory
  );

module.exports = router;
