const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Récupère le token dans les headers

  if (!token) {
    return res.status(401).json({ message: "Accès refusé, token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérifie le token avec la clé secrète
    req.user = decoded; // Ajoute les infos de l'utilisateur à la requête
    next(); // Passe à la suite (dans ton cas, la création du groupe)
  } catch (err) {
    res.status(403).json({ message: "Token invalide" });
  }
};
