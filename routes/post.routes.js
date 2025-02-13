const express = require("express");
const {
  setPosts,
  getPosts,
  deletePost,
  editPost,
} = require("../controllers/post.controler");
const router = express.Router();

router.get("/", getPosts);

router.post("/", setPosts);

router.put("/:id", editPost);

router.delete("/:id", deletePost);

module.exports = router;
