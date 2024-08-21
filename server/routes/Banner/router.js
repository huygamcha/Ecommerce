var express = require('express')
const { getAllBanner, createBanner, deleteBanner, updateBanner } = require('./controller')
const { checkCreateBanner, checkUpdateBanner } = require('./validation')
const { checkId, validateSchema } = require('../../utils')
const { admin, protect } = require('../../authentication/checkRole')
const isAuthorized = require('../../authentication/authMiddleware')
var router = express.Router()

// router.route('/').get(isAuthorized, admin, getAllBanner)
router.route('/').get(getAllBanner)
router.route('/').post(isAuthorized, admin, validateSchema(checkCreateBanner), createBanner)
router
  .route('/:id')
  .delete(isAuthorized, admin, validateSchema(checkId), deleteBanner)
  .patch(isAuthorized, admin, validateSchema(checkId), validateSchema(checkUpdateBanner), updateBanner)

module.exports = router
