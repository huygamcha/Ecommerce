var express = require('express')
const {
  getAllFooter,
  createFooter,
  deleteFooter,
  getDetailFooter,
  updateFooter
} = require('./controller')
const { checkCreateFooter, checkUpdateFooter } = require('./validation')
const { checkId, validateSchema } = require('../../utils')
const { admin, protect } = require('../../authentication/checkRole')
const isAuthorized = require('../../authentication/authMiddleware')
var router = express.Router()

router.route('/').get(getAllFooter)
router.route('/').post(isAuthorized, admin, validateSchema(checkCreateFooter), createFooter)
router
  .route('/:id')
  .delete(isAuthorized, admin, validateSchema(checkId), deleteFooter)
  .get(validateSchema(checkId), getDetailFooter)
  .patch(
    isAuthorized,
    admin,
    validateSchema(checkId),
    validateSchema(checkUpdateFooter),
    updateFooter
  )

module.exports = router
