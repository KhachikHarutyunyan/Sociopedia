import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
        min: 2,
        max: 50,
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
        min: 2,
        max: 50,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: validator.isEmail,
            message: "Please provide valid email",
        },
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        max: 6
    },
    picturePath: {
        type: String,
        default: "",
    },
    friends: {
        type: Array,
        default: [],
    },
    location: {
        type: String,
        default: "worldwide",
    },
    occupation: {
        type: String,
        default: "some",
    },
    viewedProfile: {
        type: Number,
        default: 0,
    },
    impressions: {
        type: Number,
        default: 0,
    },
}, {timestamps: true});

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function() {
    return jwt.sign({userId: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});
}

UserSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}

export default mongoose.model("User", UserSchema);