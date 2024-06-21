var express = require("express");
const {
  getAllProduct,
  createProduct,
  deleteProduct,
  getDetailProduct,
  updateProduct,
  getProductByCategories,
  getProductBySuppliers,
  getAllProductSearch,
  getDetailProductSlug,
} = require("./controller");
const { checkCreateProduct, checkUpdateProduct } = require("./validation");
const { checkId, validateSchema, checkIdQuery } = require("../../utils");
const { admin, protect } = require("../../authentication/checkRole");
var router = express.Router();

router.route("/").get(getAllProduct);
router.route("/search").get(getAllProductSearch);
router
  .route("/")
  .post(protect, admin, validateSchema(checkCreateProduct), createProduct);
router
  .route("/byCategories")
  .get(validateSchema(checkIdQuery), getProductByCategories);
router
  .route("/bySuppliers")
  .get(validateSchema(checkIdQuery), getProductBySuppliers);

router.route("/slug/:slug").get(getDetailProductSlug);
router
  .route("/:id")
  .delete(protect, admin, validateSchema(checkId), deleteProduct)
  .get(validateSchema(checkId), getDetailProduct)
  .patch(
    validateSchema(checkId),
    validateSchema(checkUpdateProduct),
    updateProduct
  );

module.exports = router;
