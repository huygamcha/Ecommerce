var express = require("express");
const {
  getAllBrand,
  createBrand,
  deleteBrand,
  getDetailBrand,
  updateBrand,
} = require("./controller");
const { checkCreateBrand, checkUpdateBrand } = require("./validation");
const { checkId, validateSchema } = require("../../utils");
const { admin, protect } = require("../../authentication/checkRole");
var router = express.Router();

router.route("/").get(getAllBrand);
router.route("/").post(validateSchema(checkCreateBrand), createBrand);
router
  .route("/:id")
  .delete(validateSchema(checkId), deleteBrand)
  .get(validateSchema(checkId), protect, admin, getDetailBrand)
  .patch(
    validateSchema(checkId),
    validateSchema(checkUpdateBrand),
    updateBrand
  );

module.exports = router;
