import express from "express";
import { addComment, deleteComment, updateComment, getAllComments, getSingleComment} from "../controller/commentsController.js";

const router = express.Router();

router.route("/:postId").get(getAllComments).post(addComment);
router.route("/:postId/:commentId").get(getSingleComment).patch(updateComment).delete(deleteComment);

export default router;