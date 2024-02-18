var express = require("express");
const {
  getAllCart,
  createCart,
  deleteCart,
  getDetailCart,
} = require("./controller");
const { checkCreateCart } = require("./validation");
const { checkId, validateSchema } = require("../../utils");
var router = express.Router();

router.route("/").get(getAllCart);
router.route("/").post(validateSchema(checkCreateCart), createCart);
router
  .route("/:id")
  .delete(validateSchema(checkId), deleteCart)
  .get(validateSchema(checkId), getDetailCart);

module.exports = router;
