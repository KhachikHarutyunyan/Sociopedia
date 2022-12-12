import {StatusCodes} from "http-status-codes";
import {BadRequestError, NotFoundError, UnauthenticatedError} from "../errors/index.js";
import User from "../models/User.js";


const register = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;

    if (!firstName || !lastName || !email || !password) throw new BadRequestError("Please provide all values");

    const isEmailTaken = await User.findOne({email});
    if (isEmailTaken) throw new BadRequestError("Email allready taken please choose another on!");

    const user = await User.create({firstName, lastName, email, password});
    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({user: {firstName: user.firstName, lastName: user.lastName, email: user.email}, token});
}

const login = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) throw new BadRequestError("Please provide all values");
    
    const user = await User.findOne({email});
    if (!user) throw new UnauthenticatedError("Invalid credentials");

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) throw new UnauthenticatedError("Invalid credentials");

    const token = user.createJWT();
    user.password = undefined;

    res.status(StatusCodes.OK).json({user, token});
}

const logout = async (req, res) => {

    res.send("logout");
}

const updateUser = async (req, res) => {
    const {firstName, lastName, email, location, picturePath} = req.body;

    if (!firstName || !lastName || !email || !location || ! picturePath) throw new BadRequestError("Please provide all values");

    const user = await User.findOne({email});
    if (!user) throw new NotFoundError("Invalid Credentials");

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.location = location;
    user.picturePath = picturePath;

    await user.save();
    const token = await user.createJWT();

    res.status(StatusCodes.OK).json({user, token});
}


export {register, login, logout, updateUser};