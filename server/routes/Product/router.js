var express = require("express");
const {
  getAllProduct,
  createProduct,
  deleteProduct,
  getDetailProduct,
  updateProduct,
} = require("./controller");
const { checkCreateProduct, checkUpdateProduct } = require("./validation");
const { checkId, validateSchema } = require("../../utils");
var router = express.Router();

router.route("/").get(getAllProduct);
router.route("/").post(validateSchema(checkCreateProduct), createProduct);
router
  .route("/:id")
  .delete(validateSchema(checkId), deleteProduct)
  .get(validateSchema(checkId), getDetailProduct)
  .patch(
    validateSchema(checkId),
    validateSchema(checkUpdateProduct),
    updateProduct
  );

module.exports = router;
