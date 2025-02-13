const express = require("express");
const { user } = require("../controllers/user.controler.js");
const router = express.Router();

router.get("/", user);

module.exports = router;
