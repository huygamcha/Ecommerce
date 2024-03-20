var express = require("express");
const {
  getAllBanner,
  createBanner,
  deleteBanner,
  updateBanner,
} = require("./controller");
const { checkCreateBanner, checkUpdateBanner } = require("./validation");
const { checkId, validateSchema } = require("../../utils");
const { admin, protect } = require("../../authentication/checkRole");
var router = express.Router();

router.route("/").get(getAllBanner);
router.route("/").post(validateSchema(checkCreateBanner), createBanner);
router
  .route("/:id")
  .delete(validateSchema(checkId), deleteBanner)
  .patch(
    validateSchema(checkId),
    validateSchema(checkUpdateBanner),
    updateBanner
  );

module.exports = router;
