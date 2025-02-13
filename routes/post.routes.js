const express = require("express");
const {
  setPosts,
  getPosts,
  deletePost,
  editPost,
  likePost,
  dislikePost,
} = require("../controllers/post.controler");
const router = express.Router();

router.get("/", getPosts);

router.post("/", setPosts);

router.put("/:id", editPost);

router.delete("/:id", deletePost);

router.patch("/like-post/:id", likePost);

router.patch("/dislike-post/:id", dislikePost);

module.exports = router;
