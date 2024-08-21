var express = require('express')
const {
  getAllTag,
  createTag,
  deleteTag,
  getDetailTag,
  updateTag,
  getDetailTagSlug
} = require('./controller')
const { checkCreateTag, checkUpdateTag } = require('./validation')
const { checkId, validateSchema } = require('../../utils')
const { admin, protect } = require('../../authentication/checkRole')
const isAuthorized = require('../../authentication/authMiddleware')
var router = express.Router()

router.route('/').get(getAllTag)
// router.route('/').post(protect, admin, validateSchema(checkCreateTag), createTag)
router.route('/').post(isAuthorized, admin, validateSchema(checkCreateTag), createTag)

router.route('/name/:tag').get(getDetailTagSlug)

router
  .route('/:id')
  // .delete(protect, admin, validateSchema(checkId), deleteTag)
  .delete(isAuthorized, admin, validateSchema(checkId), deleteTag)
  .get(validateSchema(checkId), protect, admin, getDetailTag)
  .patch(isAuthorized, admin, validateSchema(checkId), validateSchema(checkUpdateTag), updateTag)

module.exports = router
