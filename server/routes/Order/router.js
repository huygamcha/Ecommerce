var express = require("express");
const {
  getAllOrder,
  createOrder,
  deleteOrder,
  getDetailOrder,
  updateOrder,
} = require("./controller");
const { checkId, validateSchema } = require("../../utils");
const { admin, protect } = require("../../authentication/checkRole");
const isAuthorized = require("../../authentication/authMiddleware");
var router = express.Router();

router.route("/").get(getAllOrder);
// router.route("/").post(validateSchema(checkCreateOrder), createOrder);
router.route("/").post(createOrder);
router
  .route("/:id")
  .delete(isAuthorized, admin, validateSchema(checkId), deleteOrder)
  .get(validateSchema(checkId), getDetailOrder)
  // .patch(
  //   validateSchema(checkId),
  //   validateSchema(checkUpdateOrder),
  //   updateOrder
  // );
  .patch(isAuthorized, admin, validateSchema(checkId), updateOrder);

module.exports = router;
