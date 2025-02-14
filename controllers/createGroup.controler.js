const Group = require("../models/group.model.js");
const userModel = require("../models/user.model");

module.exports.createGroup = async (req, res) => {
  const { groupName, groupTheme } = req.body;
  const adminId = req.user.userId;

  const user = await userModel.findById({ _id: adminId });

  try {
    const newGroup = await Group.create({
      admin: adminId,
      groupName,
      groupTheme,
      members: {
        _id: adminId,
        username: user.username,
        status: "Admin",
      },
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
      $or: [{ admin: adminId }, { members: { $elemMatch: { _id: adminId } } }],
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

module.exports.invitationToGroup = async (req, res) => {
  console.log(req.body);

  const groupId = req.body.groupId;
  const usernameOfInvited = req.body.usernameOfInvited;
  try {
    const groupToInvite = await Group.findOne({ _id: groupId });
    if (!groupToInvite) {
      return res.status(400).json({ message: "Groupe introuvable" });
    }

    const userToInvite = await userModel.findOne({
      username: usernameOfInvited,
    });

    if (!userToInvite) {
      return res.status(400).json({ message: "Membre introuvable" });
    }
    console.log("avant");

    if (
      groupToInvite.members.some(
        (member) => member._id.toString() === userToInvite._id.toString()
      )
    ) {
      return res
        .status(400)
        .json({ message: "L'utilisateur est déjà membre du groupe" });
    }

    console.log("après");

    groupToInvite.members.push({
      _id: userToInvite._id,
      username: userToInvite.username,
      status: "pending",
    });

    await groupToInvite.save();

    res.status(201).json({ message: "Invitation envoyer avec succés" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la l'invitation" });
  }
};
