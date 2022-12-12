import express from "express";
import {getAllPosts, getSinglePost, getUserPosts, createPost, updatePost, deletePost, likePost} from "../controller/postController.js";
import upload from "../utils/upload.js";
const router = express.Router();

router.route("/").get(getAllPosts).post(upload.single("picture"), createPost);
router.route("/:id").get(getSinglePost).patch(upload.single("picture"), updatePost).delete(deletePost);
router.route("/:id/posts").get(getUserPosts);
router.route("/:id/like").patch(likePost);

export default router;