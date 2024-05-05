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
var router = express.Router();

router.route("/").get(getAllOrder);
// router.route("/").post(validateSchema(checkCreateOrder), createOrder);
router.route("/").post(protect, admin, createOrder);
router
  .route("/:id")
  .delete(protect, admin, validateSchema(checkId), deleteOrder)
  .get(validateSchema(checkId), getDetailOrder)
  // .patch(
  //   validateSchema(checkId),
  //   validateSchema(checkUpdateOrder),
  //   updateOrder
  // );
  .patch(protect, admin, validateSchema(checkId), updateOrder);

module.exports = router;
