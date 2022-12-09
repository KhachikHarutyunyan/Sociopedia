import {StatusCodes} from "http-status-codes";
import {NotFoundError} from "../errors/index.js";
import User from "../models/User.js";


const getUser = async (req, res) => {
    const {id: userId} = req.params;
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    res.status(StatusCodes.OK).json({user});
}

const getUserFriends = async (req, res) => {
    const {id: userId} = req.params;

    const user = await User.findById(userId);

    const friends = await Promise.all(user.friends.map(id => User.findById(id)));
    const formatedFriends = friends.map((friend) => {return {...friend}});

    res.status(StatusCodes.OK).json(formatedFriends);
}

const addRemoveFriend = async (req, res) => {
    const {id: userId, friendId} = req.params;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
        user.friends = user.friends.filter(id => id !== friendId);
        friend.friends = friend.friends.filter(id => id !== id);
    } else {
        user.friends.push(friendId);
        friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(user.friends.map(id => User.findById(id)));
    const formatedFriends = friends.map((friend) => {return {...friend}});

    res.status(StatusCodes.OK).json(formatedFriends);
}


export {getUser, getUserFriends, addRemoveFriend};