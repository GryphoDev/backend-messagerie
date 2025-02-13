const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("../models/user.model");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

module.exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUsername = await userModel.findOne({ username });
    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "Le nom d'utilisateur est déjà pris" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username: username,
      password: hashedPassword,
    });
    const token = generateToken(newUser._id);
    res
      .status(200)
      .json({ token, user: { id: newUser._id, username: newUser.username } });
  } catch (error) {
    res.status(400).json({
      message: "Un problème est survenue lors de la création du compte",
      error,
    });
  }
};
