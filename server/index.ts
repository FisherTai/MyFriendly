import express from "express";
import cors from "cors";
import { connect } from "mongoose";
import dotenv from "dotenv";
const userRoutes = require("./routes/user-route");
const messageRoutes = require("./routes/message-route");
import { Server } from "socket.io";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "./socket-io-interface";
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

// mongoose 6以後不再需要設定useNewUrlParser跟useUnifiedTopology為true
connect(process.env.MONGO_DB_LOCAL!)
  .then(() => {
    console.log("Conntect to Mongo Altas");
  })
  .catch((e: any) => {
    console.log(e);
  });

const server = app.listen(process.env.LOCAL_PORT, () => {
  console.log(`server listening on port ${process.env.LOCAL_PORT}`);
});

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: `http://localhost:${process.env.CLIENT_PORT}`,
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("socket.io connected");
  global.chatSocket = socket;
  socket.on("addUser", (userId) => {
    console.log(`add user:${userId} , ${socket.id}`);
    onlineUsers.set(userId, socket.id);
  });

  socket.on("sendMsg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      console.log(`send msg:${data.from} to  ${data.to} , ${data.message}`);
      socket.to(sendUserSocket).emit("msgRecieve", data.message);
    }
  });
});
