const express = require('express')
const { login, refreshToken } = require('./controller')
const { loginSchema } = require('./validations')
const { validateSchema } = require('../../utils')
const router = express.Router()

router.route('/login').post(validateSchema(loginSchema), login)
router.route('/refreshToken').post(refreshToken)

module.exports = router
