const Group = require("../models/group.model.js");

module.exports.createGroup = async (req, res) => {
  const { groupName, groupTheme } = req.body;
  const adminId = req.user.id;
  console.log(req);

  try {
    const newGroup = new Group({
      admin: adminId,
      groupName,
      groupTheme,
      members: [adminId],
    });

    await newGroup.save();
    res
      .status(201)
      .json({ message: "Groupe créé avec succès", group: newGroup });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la création du groupe" });
  }
};
