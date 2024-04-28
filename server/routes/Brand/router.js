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
router
  .route("/")
  .post(protect, admin, validateSchema(checkCreateBrand), createBrand);
router
  .route("/:id")
  .delete(protect, admin, validateSchema(checkId), deleteBrand)
  .get(validateSchema(checkId), getDetailBrand)
  .patch(
    protect,
    admin,
    validateSchema(checkId),
    validateSchema(checkUpdateBrand),
    updateBrand
  );

module.exports = router;
