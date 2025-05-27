import express from "express";
import userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const userRouter = express.Router();

// Add upload.single('profile') middleware for signup
userRouter.post("/signup", upload.single("profile"), userController.userSignUp);
userRouter.post("/login", userController.userLogin);
userRouter.post("/auth/refresh-token", userController.refreshToken);
userRouter.post("/logout", authMiddleware, userController.userLogout);
userRouter.get("/check-auth", authMiddleware, userController.checkAuth);

export default userRouter;
