const express = require("express");
const { login } = require("./controller");
const { loginSchema } = require("./validations");
const { validateSchema } = require("../../utils");
const router = express.Router();

router.route("/login").post(validateSchema(loginSchema), login);

module.exports = router;
