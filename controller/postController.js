import { StatusCodes } from "http-status-codes";
import Post from "../models/Post.js";
import {BadRequestError, NotFoundError, UnauthorizedError} from "../errors/index.js";
import User from "../models/User.js";
import checkPermission from "../utils/checkPermission.js";

const createPost = async (req, res) => {
    const {description, picturePath} = req.body;
    if (!description || !picturePath) throw new BadRequestError("Please provide all values");
    
    const user = await User.findById(req.user.userId);
    
    const post = await Post.create({description, picturePath, lastName: user.lastName,
             firstName: user.firstName, author: user._id, userPicturePath: user.picturePath, location: user.location});
             
    res.status(StatusCodes.CREATED).json({post});
}

const getAllPosts = async (req, res) => {
    const posts = await Post.find({});

    res.status(StatusCodes.OK).json({posts});
}

const getUserPosts = async (req, res) => {
    const {id: userId} = req.params;

    const posts = await Post.find({author: userId});

    res.status(StatusCodes.OK).json({posts});
}

const getSinglePost = async (req, res) => {
    const {id: postId} = req.params;

    const post = await Post.findOne({_id: postId});
    if (!post) throw new NotFoundError("Post not found");

    res.status(StatusCodes.OK).json({post});
}

const updatePost = async (req, res) => {
    const {id: postId} = req.params;

    const post = await Post.findOne({_id: postId});
    if (!post) throw new NotFoundError("Post not found");

    checkPermission(req.user, post.author);

    const updatedPost = await Post.findOneAndUpdate({_id: postId}, req.body, {new: true, runValidators: true});

    res.status(StatusCodes.OK).json({updatedPost});
}

const deletePost = async (req, res) => {
    const {id: postId} = req.params;

    const post = await Post.findOne({_id: postId});
    if (!post) throw new NotFoundError("Post not found");

    checkPermission(req.user, post.author);

    await post.remove();
    res.status(StatusCodes.OK).json({msg: "Post has been removed"});
}

const likePost = async (req, res) => {
    const {id} = req.params;

    const post = await Post.findById(id);
    const isLiked = post.likes.get(req.user.userId);

    if (isLiked) {
        post.likes.delete(req.user.userId);
    } else {
        post.likes.set(req.user.userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(id, {likes: post.likes}, {new: true});

    res.status(StatusCodes.OK).json({updatedPost});
}


export {getAllPosts, getSinglePost, getUserPosts, createPost, updatePost, deletePost, likePost};