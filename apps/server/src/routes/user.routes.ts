import { Router } from "express";
import { login, logout, register,profile, refreshToken } from "../controllers/user.controller.ts";
import verifyAuth from "../middlewares/verifyAuth.middleware.ts";

const userRouter = Router();

userRouter.route("/register").post(register)
userRouter.route("/login").post(login)
userRouter.route("/logout").post(verifyAuth,logout)
userRouter.route("/refresh").post(refreshToken)
userRouter.route("/me").get(verifyAuth,profile)


export default userRouter;