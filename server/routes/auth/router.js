const express = require("express");
const { login } = require("./controller");
const router = express.Router();

router.route("/login").post(login);

module.exports = router;
