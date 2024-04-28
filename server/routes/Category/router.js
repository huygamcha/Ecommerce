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
const { admin, protect } = require("../../authentication/checkRole");
var router = express.Router();

router.route("/").get(getAllCategory);
router
  .route("/")
  .post(protect, admin, validateSchema(checkCreateCategory), createCategory);
router
  .route("/:id")
  .delete(validateSchema(checkId), deleteCategory)
  .get(validateSchema(checkId), protect, admin, getDetailCategory)
  .patch(
    protect,
    admin,
    validateSchema(checkId),
    validateSchema(checkUpdateCategory),
    updateCategory
  );

module.exports = router;
