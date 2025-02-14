const express = require("express");
const router = express.Router();
const {
  createGroup,
  getAllGroups,
  deleteGroup,
} = require("../controllers/createGroup.controler.js");
const { auth } = require("../middleware/auth.js");

// ✅ Route pour créer un groupe
router.post("/", auth, createGroup);
router.get("/", auth, getAllGroups);
router.delete("/", auth, deleteGroup);
module.exports = router;
