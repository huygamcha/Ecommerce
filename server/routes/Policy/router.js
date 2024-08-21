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
const isAuthorized = require("../../authentication/authMiddleware");
var router = express.Router();

router.route("/").get(getAllPolicy);
router
  .route("/")
  .post(isAuthorized, admin, validateSchema(checkCreatePolicy), createPolicy);

router.route("/:search").get(getDetailPolicy);
router
  .route("/:id")
  .delete(isAuthorized, admin, validateSchema(checkId), deletePolicy)
  .patch(
    isAuthorized,
    admin,
    validateSchema(checkId),
    validateSchema(checkUpdatePolicy),
    updatePolicy
  );

module.exports = router;
