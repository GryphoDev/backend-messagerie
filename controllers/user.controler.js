const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.user = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    // Décodage et vérification du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupération de l'utilisateur à partir de l'ID décodé
    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Retourner les informations de l'utilisateur
    res.json({ username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
