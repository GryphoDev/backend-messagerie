const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("../models/user.model");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const findUser = await userModel.findOne({ username });
    if (!findUser) {
      return res
        .status(400)
        .json({ message: "Vérifier votre nom d'utilisateur" });
    }
    const isMatchedPasswords = await bcrypt.compare(
      password,
      findUser.password
    );
    if (!isMatchedPasswords) {
      return res.status(400).json({ message: "Vérifier votre mot de passe" });
    }

    const token = generateToken(findUser._id);
    res
      .status(200)
      .json({ token, user: { id: findUser._id, username: findUser.username } });
  } catch (error) {
    res.status(400).json({
      message: "Un problème est survenue lors de l'authentification",
      error,
    });
  }
};
