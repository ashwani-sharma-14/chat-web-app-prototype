import http from "http";
import app from "./app.js";
import env from "./config/env.js";
import { Server } from "socket.io";
import { dbConnection } from "./config/dbConfig.js";
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const userSocketMap = {};

export function getRecieverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("onlineUsers", Object.keys(userSocketMap));
  }

  socket.on("disconnect", () => {
    // Find userId using socket.id
    const disconnectedUserId = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );

    if (disconnectedUserId) {
      delete userSocketMap[disconnectedUserId];
      io.emit("onlineUsers", Object.keys(userSocketMap));
    }
  });
});

server.listen(env.port, () => {
  dbConnection();
  console.log("Server is listning at port:", env.port);
});
