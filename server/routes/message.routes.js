import express from "express";
import messageController from "../controllers/message.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const messageRouter = express.Router();

messageRouter.use(authMiddleware);

messageRouter.get("/users", messageController.getUsers);

messageRouter.get("/:id", messageController.getMessages);

messageRouter.post("/:id", messageController.sendMessages);

messageRouter.post(
  "/upload/image",
  upload.single("image"),
  messageController.uploadMedia
);

messageRouter.post(
  "/upload/video",
  upload.single("video"),
  messageController.uploadMedia
);

export default messageRouter;
