const express = require("express");
const router = express.Router();
const groupController = require("../controllers/createGroup.controler.js");
const auth = require("../middleware/auth");

// ✅ Route pour créer un groupe
router.post("/", auth, groupController.createGroup);

module.exports = router;
