const Group = require("../models/group.model.js");
const userModel = require("../models/user.model");
const GroupMessages = require("../models/groupMessages.model");

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

module.exports.responseInvitation = async (req, res) => {
  const userId = req.user.userId;
  const response = req.body.responseInvitation;

  try {
    const groupId = await Group.findById(req.body.groupId);
    if (!groupId) {
      return res.status(400).json({ message: "Le group n'est pas trouvé" });
    }

    if (response === "accepted") {
      const updatedGroup = await Group.findOneAndUpdate(
        { _id: groupId, "members._id": userId },
        { $set: { "members.$.status": "accepted" } },
        { new: true }
      );
      if (!updatedGroup) {
        return res.status(400).json({ message: "Erreur" });
      }
      res.status(200).json({ message: "Invitation accépté" });
    } else if (response === "rejected") {
      // Suppression du membre de la liste et de l'invitation
      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        {
          $pull: { members: { _id: userId }, invitations: userId },
        },
        { new: true }
      );

      return res
        .status(200)
        .json({ message: "Invitation refusée", group: updatedGroup });
    }
    return res.status(400).json({ message: "Réponse invalide" });
  } catch (error) {}
};

module.exports.postNewGroupMessage = async (req, res) => {
  try {
    const { groupId, message } = req.body;
    const userId = req.user?.userId; // Vérifie que l'utilisateur est bien authentifié

    if (!groupId || !userId || !message) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const newMessage = await GroupMessages.create({
      groupId,
      author: userId,
      message: message,
    });

    res
      .status(201)
      .json({ message: "Message envoyé avec succès", data: newMessage });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    res.status(500).json({
      error: "Une erreur est survenue, veuillez réessayer plus tard.",
    });
  }
};

module.exports.getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user?.userId;

    const messages = await GroupMessages.find({ groupId }).populate(
      "author",
      "username"
    );

    res
      .status(201)
      .json({ message: "Voici les messages du groupe", data: messages });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    res.status(500).json({
      error: "Une erreur est survenue, veuillez réessayer plus tard.",
    });
  }
};

module.exports.updateGroupMessage = async (req, res) => {
  try {
    console.log(req.body);
    const { groupId } = req.params;

    const updatedPost = await GroupMessages.findByIdAndUpdate(
      groupId,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedPost) {
      return res.status(400).json({ message: "Ce post n'existe pas !!" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports.deleteGroupMessage = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedPost = await GroupMessages.deleteOne({ _id: id });
    res.json(deletedPost);
  } catch (error) {
    res.status(400).json(error);
  }
};
