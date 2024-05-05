var express = require("express");
const {
  getAllLocation,
  createLocation,
  deleteLocation,
  updateLocation,
  getDetailLocation,
} = require("./controller");
const { checkCreateLocation, checkUpdateLocation } = require("./validation");
const { checkId, validateSchema } = require("../../utils");
const { admin, protect } = require("../../authentication/checkRole");
var router = express.Router();

router.route("/").get(getAllLocation);
router
  .route("/")
  .post(protect, admin, validateSchema(checkCreateLocation), createLocation);
router
  .route("/:id")
  .delete(protect, admin, validateSchema(checkId), deleteLocation)
  .get(protect, admin, validateSchema(checkId), getDetailLocation)
  .patch(
    protect,
    admin,
    validateSchema(checkId),
    validateSchema(checkUpdateLocation),
    updateLocation
  );

module.exports = router;
