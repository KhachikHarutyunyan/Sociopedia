import express from "express";
import { register, login, logout, updateUser } from "../controller/authController.js";
import upload from "../utils/upload.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/updateUser").patch(upload.single("picture"), updateUser);


export default router;