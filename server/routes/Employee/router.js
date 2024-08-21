var express = require("express");
const {
  getAllEmployee,
  createEmployee,
  deleteEmployee,
  getDetailEmployee,
  updateEmployee,
} = require("./controller");
const { checkCreateEmployee, checkUpdateEmployee } = require("./validation");
const { checkId, validateSchema } = require("../../utils");
var router = express.Router();

router.route("/").get(getAllEmployee);
router.route("/getMe").get(getAllEmployee);
router.route("/").post(validateSchema(checkCreateEmployee), createEmployee);
router
  .route("/:id")
  .delete(validateSchema(checkId), deleteEmployee)
  .get(validateSchema(checkId), getDetailEmployee)
  .patch(
    validateSchema(checkId),
    validateSchema(checkUpdateEmployee),
    updateEmployee
  );

module.exports = router;
