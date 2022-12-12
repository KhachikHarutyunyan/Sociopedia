import mongoose from "mongoose";

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
    comments: {
        type: Array,
        default: []
    },
}, {timestamps: true});


export default mongoose.model("Post", PostSchema);