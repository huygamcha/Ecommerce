var express = require('express')
const {
  getAllLocation,
  createLocation,
  deleteLocation,
  updateLocation,
  getDetailLocation
} = require('./controller')
const { checkCreateLocation, checkUpdateLocation } = require('./validation')
const { checkId, validateSchema } = require('../../utils')
const { admin, protect } = require('../../authentication/checkRole')
const isAuthorized = require('../../authentication/authMiddleware')
var router = express.Router()

router.route('/').get(getAllLocation)
router.route('/').post(isAuthorized, admin, validateSchema(checkCreateLocation), createLocation)
router
  .route('/:id')
  .delete(isAuthorized, admin, validateSchema(checkId), deleteLocation)
  .get(validateSchema(checkId), getDetailLocation)
  .patch(
    isAuthorized,
    admin,
    validateSchema(checkId),
    validateSchema(checkUpdateLocation),
    updateLocation
  )

module.exports = router
