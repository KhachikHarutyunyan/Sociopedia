import { StatusCodes } from "http-status-codes";
import Post from "../models/Post.js";
import {BadRequestError, NotFoundError, UnauthorizedError} from "../errors/index.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import checkPermission from "../utils/checkPermission.js";


const addComment = async (req, res) => {
    const {postId} = req.params;
    const {text} = req.body;

    if (!text) throw new BadRequestError("Please provide all values");

    const post = await Post.findOne({_id: postId});

    if (!post) throw new NotFoundError("Post not found");

    const user = await User.findOne({_id: req.user.userId});

    const newComment = {text, post: post._id, image: user.picturePath, firstName: user.firstName, lastName: user.lastName, user: user._id};
    post.comments.push(newComment);

    await post.save();
    res.status(StatusCodes.CREATED).json({post});
}
import mongoose from "mongoose";

const getAllComments = async (req, res) => {
    const {postId} = req.params;
    const post = await Post.aggregate([
        {$match: {_id: mongoose.Types.ObjectId(postId)}},
        {
            $project: {
                _id: 0,
                comments: {
                    $sortArray: {
                        input: "$comments",
                        sortBy:{"createdAt": -1}
                    }
                }
            }
        },
    ]);
    // const comments = post.comments.select("-createdAt");
    console.log(post);

    res.status(StatusCodes.OK).json({comments: post.comments, count: post.comments.length});
}

const getSingleComment = async (req, res) => {
    const {postId, commentId} = req.params;
    const post = await Post.findOne({_id: postId});
    if (!post) throw new NotFoundError("Post not found");

    const comment = post.comments.find((comment) => comment._id.toString() === commentId);
    if (!comment) throw new NotFoundError("Comment not found");
    
    res.status(StatusCodes.OK).json({comment});
}

const updateComment = async (req, res) => {
    const {commentId, postId} = req.params;
    const {text} = req.body;

    if (!text) throw new BadRequestError("Please provide all values");

    const user = await User.findById(req.user.userId);

    const post = await Post.findOne({_id: postId});
    const comment = post.comments.find((comment) => comment._id.toString() === commentId);

    const newComment = {...comment, text};
    console.log(newComment);
    // post.comments = comments;

    // await post.save();

    res.status(StatusCodes.OK).json({msg: "Comment has been deleted"});
}

const deleteComment = async (req, res) => {
    const {commentId, postId} = req.params;

    const post = await Post.findOne({_id: postId});
    const comments = post.comments.filter((comment) => comment._id.toString() !== commentId);

    post.comments = comments;

    await post.save();

    res.status(StatusCodes.OK).json({msg: "Comment has been deleted", post});
}


export {addComment, updateComment, deleteComment, getAllComments, getSingleComment};