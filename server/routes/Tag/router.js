var express = require("express");
const {
  getAllTag,
  createTag,
  deleteTag,
  getDetailTag,
  updateTag,
} = require("./controller");
const { checkCreateTag, checkUpdateTag } = require("./validation");
const { checkId, validateSchema } = require("../../utils");
const { admin, protect } = require("../../authentication/checkRole");
var router = express.Router();

router.route("/").get(getAllTag);
router.route("/").post(validateSchema(checkCreateTag), createTag);
router
  .route("/:id")
  .delete(validateSchema(checkId), deleteTag)
  .get(validateSchema(checkId), protect, admin, getDetailTag)
  .patch(validateSchema(checkId), validateSchema(checkUpdateTag), updateTag);

module.exports = router;
