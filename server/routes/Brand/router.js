var express = require('express')
const {
  getAllBrand,
  createBrand,
  deleteBrand,
  getDetailBrand,
  updateBrand,
  getDetailByName
} = require('./controller')
const { checkCreateBrand, checkUpdateBrand } = require('./validation')
const { checkId, validateSchema } = require('../../utils')
const { admin, protect } = require('../../authentication/checkRole')
const isAuthorized = require('../../authentication/authMiddleware')
var router = express.Router()

router.route('/').get(getAllBrand)
router.route('/').post(isAuthorized, admin, validateSchema(checkCreateBrand), createBrand)
router.route('/name/:name').get(getDetailByName)
router
  .route('/:id')
  .delete(isAuthorized, admin, validateSchema(checkId), deleteBrand)
  .get(validateSchema(checkId), getDetailBrand)
  .patch(
    isAuthorized,
    admin,
    validateSchema(checkId),
    validateSchema(checkUpdateBrand),
    updateBrand
  )

module.exports = router
