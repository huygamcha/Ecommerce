var express = require("express");
const {
  getAllCustomer,
  createCustomer,
  deleteCustomer,
  getDetailCustomer,
  updateCustomer,
} = require("./controller");
const { checkCreateCustomer, checkUpdateCustomer } = require("./validation");
const { checkId, validateSchema } = require("../../utils");
var router = express.Router();

router.route("/").get(getAllCustomer);
router.route("/").post(validateSchema(checkCreateCustomer), createCustomer);
router
  .route("/:id")
  .delete(validateSchema(checkId), deleteCustomer)
  .get(validateSchema(checkId), getDetailCustomer)
  .patch(
    validateSchema(checkId),
    validateSchema(checkUpdateCustomer),
    updateCustomer
  );

module.exports = router;
