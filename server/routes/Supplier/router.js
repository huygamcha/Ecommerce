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
var router = express.Router();

router.route("/").get(getAllSupplier);
router.route("/").post(validateSchema(checkCreateSupplier), createSupplier);
router
  .route("/:id")
  .delete(validateSchema(checkId), deleteSupplier)
  .get(validateSchema(checkId), getDetailSupplier)
  .patch(
    validateSchema(checkId),
    validateSchema(checkUpdateSupplier),
    updateSupplier
  );

module.exports = router;
