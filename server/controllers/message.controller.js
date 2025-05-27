import { User } from "../models/user.model.js";
import Message from "../models/message.model.js";
import { get } from "mongoose";
import { getRecieverSocketId, io } from "../index.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select(
      "-password"
    );
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: req.params.id },
        { senderId: req.params.id, receiverId: req.user.id },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendMessages = async (req, res) => {
  try {
    const { text, image, video } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user.id;

    const message = new Message({
      senderId,
      receiverId,
      text,
      image,
      video,
    });

    await message.save();

    const receiverSocketId = getRecieverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.fieldname === "video" ? "video" : "image"
    );

    res.status(200).json({
      message: "Media uploaded successfully",
      url: result.secure_url,
      type: req.file.fieldname,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload media" });
  }
};

const messageController = {
  getUsers,
  getMessages,
  sendMessages,
  uploadMedia, // Add this to the controller
};

export default messageController;
