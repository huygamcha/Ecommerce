var express = require("express");
const {
  getAllPolicy,
  createPolicy,
  deletePolicy,
  updatePolicy,
  getDetailPolicy,
} = require("./controller");
const { checkCreatePolicy, checkUpdatePolicy } = require("./validation");
const { checkId, validateSchema } = require("../../utils");
const { protect, admin } = require("../../authentication/checkRole");
var router = express.Router();

router.route("/").get(getAllPolicy);
router
  .route("/")
  .post(protect, admin, validateSchema(checkCreatePolicy), createPolicy);

router.route("/:search").get(getDetailPolicy);
router
  .route("/:id")
  .delete(protect, admin, validateSchema(checkId), deletePolicy)
  .patch(
    protect,
    admin,
    validateSchema(checkId),
    validateSchema(checkUpdatePolicy),
    updatePolicy
  );

module.exports = router;
