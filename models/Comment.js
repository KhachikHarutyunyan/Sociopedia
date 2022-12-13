import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    
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
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
    },
    post: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Post",
    },
}, {timestamps: true});

CommentSchema.index({post: 1, user: 1});

export default mongoose.model("Comment", CommentSchema);