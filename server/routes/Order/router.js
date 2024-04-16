var express = require("express");
const {
  getAllOrder,
  createOrder,
  deleteOrder,
  getDetailOrder,
  updateOrder,
} = require("./controller");
const { checkCreateOrder, checkUpdateOrder } = require("./validation");
const { checkId, validateSchema } = require("../../utils");
var router = express.Router();

router.route("/").get(getAllOrder);
// router.route("/").post(validateSchema(checkCreateOrder), createOrder);
router.route("/").post(createOrder);
router
  .route("/:id")
  .delete(validateSchema(checkId), deleteOrder)
  .get(validateSchema(checkId), getDetailOrder)
  // .patch(
  //   validateSchema(checkId),
  //   validateSchema(checkUpdateOrder),
  //   updateOrder
  // );
  .patch(validateSchema(checkId), updateOrder);

module.exports = router;
