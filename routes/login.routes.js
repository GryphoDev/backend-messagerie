const express = require("express");
const { login } = require("../controllers/login.controler.js");
const router = express.Router();

router.post("/", login);

module.exports = router;
