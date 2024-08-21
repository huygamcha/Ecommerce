var express = require('express')
const {
  getAllCategory,
  createCategory,
  deleteCategory,
  getDetailCategory,
  updateCategory,
  getDetailCategoryByName
} = require('./controller')
const { checkCreateCategory, checkUpdateCategory } = require('./validation')
const { checkId, validateSchema } = require('../../utils')
const { admin, protect } = require('../../authentication/checkRole')
const isAuthorized = require('../../authentication/authMiddleware')
var router = express.Router()

router.route('/').get(getAllCategory)
router.route('/').post(isAuthorized, admin, validateSchema(checkCreateCategory), createCategory)
router.route('/name/:name').get(getDetailCategoryByName)
router
  .route('/:id')
  .delete(isAuthorized, admin, validateSchema(checkId), deleteCategory)
  .get(validateSchema(checkId), isAuthorized, admin, getDetailCategory)
  .patch(
    isAuthorized,
    admin,
    validateSchema(checkId),
    validateSchema(checkUpdateCategory),
    updateCategory
  )

module.exports = router
