var express = require("express");
const {
  getAllFooter,
  createFooter,
  deleteFooter,
  getDetailFooter,
  updateFooter,
} = require("./controller");
const { checkCreateFooter, checkUpdateFooter } = require("./validation");
const { checkId, validateSchema } = require("../../utils");
const { admin, protect } = require("../../authentication/checkRole");
var router = express.Router();

router.route("/").get(getAllFooter);
router
  .route("/")
  .post(protect, admin, validateSchema(checkCreateFooter), createFooter);
router
  .route("/:id")
  .delete(protect, admin, validateSchema(checkId), deleteFooter)
  .get(validateSchema(checkId), protect, admin, getDetailFooter)
  .patch(
    protect,
    admin,
    validateSchema(checkId),
    validateSchema(checkUpdateFooter),
    updateFooter
  );

module.exports = router;
