const Group = require("../models/group.model.js");

module.exports.createGroup = async (req, res) => {
  const { groupName, groupTheme } = req.body;
  const adminId = req.user.userId;

  try {
    const newGroup = await Group.create({
      admin: adminId,
      groupName,
      groupTheme,
      members: [adminId],
    });

    res
      .status(201)
      .json({ message: "Groupe créé avec succès", group: newGroup });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du groupe" });
  }
};

module.exports.getAllGroups = async (req, res) => {
  const adminId = req.user.userId;

  try {
    const allGroups = await Group.find({
      $or: [{ admin: adminId }, { members: adminId }],
    })
      .populate("admin", "username")
      .populate("members", "username");

    res.status(201).json({
      message: "Voilà tous les groupes dans lequelles vous êtes présent",
      groups: allGroups,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du groupe" });
  }
};

module.exports.deleteGroup = async (req, res) => {
  const groupId = req.body.groupId;
  const adminId = req.user.userId;

  try {
    const groupToDelete = await Group.findOne({ _id: groupId });

    if (groupToDelete.admin._id.toString() !== adminId) {
      return res
        .status(400)
        .json({ message: "La suppréssion est reservée au créateur du groupe" });
    }

    const deletedGroup = await Group.findByIdAndDelete({ _id: groupId });
    console.log(deletedGroup);

    res
      .status(201)
      .json({ message: "Groupe supprimé avec succès", deletedGroup });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du groupe" });
  }
};
