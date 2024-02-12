var express = require("express");
const {
  getAllProduct,
  createProduct,
  deleteProduct,
  getDetailProduct,
  updateProduct,
  getProductByCategories,
  getProductBySuppliers,
} = require("./controller");
const { checkCreateProduct, checkUpdateProduct } = require("./validation");
const { checkId, validateSchema, checkIdQuery } = require("../../utils");
var router = express.Router();

router.route("/").get(getAllProduct);
router.route("/").post(validateSchema(checkCreateProduct), createProduct);
router
  .route("/byCategories")
  .get(validateSchema(checkIdQuery), getProductByCategories);
router
  .route("/bySuppliers")
  .get(validateSchema(checkIdQuery), getProductBySuppliers);
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
