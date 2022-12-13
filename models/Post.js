import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    },
    text: {
        type: String,
        required: true,
        minlength: [3, "Comment cannot be less then 3 characters"],
        maxlength: [100, "Comment cannot be more then 100 characters"],
    },
    image: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    post: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Post",
    },
}, {timestamps: true});

const PostSchema = new mongoose.Schema({
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    description: {
        type: String,
    },
    userPicturePath: {
        type: String,
    },
    picturePath: {
        type: String,
    },
    likes: {
        type: Map,
        of: Boolean,
        default: {},
    },
    comments: [CommentSchema],
}, {timestamps: true});



export default mongoose.model("Post", PostSchema);