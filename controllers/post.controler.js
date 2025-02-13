const { default: mongoose } = require("mongoose");
const PostModel = require("../models/post.model.js");

module.exports.getPosts = async (req, res) => {
  try {
    const allPosts = await PostModel.find();
    res.status(200).json(allPosts);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports.setPosts = async (req, res) => {
  try {
    if (!req.body.message) {
      return res.status(400).json({ message: "Merci de rajouter un message" });
    }
    const newPost = await PostModel.create({
      message: req.body.message,
      author: req.body.author,
    });
    res.status(200).json(newPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports.editPost = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const updatedPost = await PostModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(400).json({ message: "Ce post n'existe pas !!" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const deletedPost = await PostModel.deleteOne({ _id: id });
    res.json(deletedPost);
  } catch (error) {
    res.status(400).json(error);
  }
};
