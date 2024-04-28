var express = require("express");
const {
  getAllSupplier,
  createSupplier,
  deleteSupplier,
  getDetailSupplier,
  updateSupplier,
} = require("./controller");
const { checkCreateSupplier, checkUpdateSupplier } = require("./validation");
const { checkId, validateSchema } = require("../../utils");
const { admin, protect } = require("../../authentication/checkRole");
var router = express.Router();

router.route("/").get(getAllSupplier);
router
  .route("/")
  .post(protect, admin, validateSchema(checkCreateSupplier), createSupplier);
router
  .route("/:id")
  .delete(protect, admin, validateSchema(checkId), deleteSupplier)
  .get(validateSchema(checkId), getDetailSupplier)
  .patch(
    protect,
    admin,
    validateSchema(checkId),
    validateSchema(checkUpdateSupplier),
    updateSupplier
  );

module.exports = router;
