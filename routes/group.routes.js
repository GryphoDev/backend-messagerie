const express = require("express");
const router = express.Router();
const {
  createGroup,
  getAllGroups,
  deleteGroup,
  invitationToGroup,
} = require("../controllers/createGroup.controler.js");
const { auth } = require("../middleware/auth.js");

// ✅ Route pour créer un groupe
router.post("/", auth, createGroup);
router.get("/", auth, getAllGroups);
router.delete("/", auth, deleteGroup);
router.patch("/", auth, invitationToGroup);
module.exports = router;
