import express from "express";
import * as http from 'http'
import { Server } from "socket.io";

  
import authRouter from "./routes/authRoutes.js";
import connectDB from "./configs/db.js";
import dotenv from "dotenv";
import cors from "cors";
import { corsOptions } from "./configs/cors.js";
import locationRouter from "./routes/locationRoutes.js";
import groupRoute from "./routes/groupRoutes.js";
import Message from "./models/messageModel.js";
dotenv.config();
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer,{
  cors: {
    origin: '*', // Allow all origins for CORS
    methods: ['GET', 'POST'],
  },
});


connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

app.use("/auth", authRouter);
app.use("/location", locationRouter);
app.use("/", groupRoute);

io.on('connection', (socket) => {
    socket.on('joinGroup', async(groupId) => {
      socket.join(groupId);
      const messages = await Message.find({group:groupId}).populate('user');
      socket.emit('messages', messages);
    });
  
    socket.on('sendMessage', async (data) => {
      const message = new Message(data);
      await message.save();
      socket.emit('message', message);
    });
  
    socket.on('likeMessage', async (messageId) => {
      const message = await Message.findById(messageId);
      message.likes += 1;
      await message.save();
      socket.emit('messageLiked', message);
    });
  });
  

export default httpServer;
