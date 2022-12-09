import express from "express";
import { getUser, getUserFriends, addRemoveFriend } from "../controller/userController.js";

const router = express.Router();

router.route("/:id").get(getUser);
router.route("/:id/friends").get(getUserFriends);
router.route("/:id/:friendId").patch(addRemoveFriend);

export default router;