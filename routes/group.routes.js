const express = require("express");
const router = express.Router();
const {
  createGroup,
  getAllGroups,
  deleteGroup,
  invitationToGroup,
  responseInvitation,
  postNewGroupMessage,
  getGroupMessages,
  updateGroupMessage,
  deleteGroupMessage,
} = require("../controllers/createGroup.controler.js");
const { auth } = require("../middleware/auth.js");

// ✅ Route pour créer un groupe
router.post("/", auth, createGroup);
router.post("/message", auth, postNewGroupMessage);
router.put("/message/:groupId", updateGroupMessage);
router.get("/:groupId/message", auth, getGroupMessages);
router.delete("/message/:id", deleteGroupMessage);
router.get("/", auth, getAllGroups);
router.delete("/", auth, deleteGroup);
router.patch("/", auth, invitationToGroup);
router.put("/", auth, responseInvitation);
module.exports = router;
