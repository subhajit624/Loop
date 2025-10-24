import express from "express";
import dotenv from "dotenv";
dotenv.config({});
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./db/connect.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import saveRoutes from './routes/saveRoutes.js';
import followRoutes from './routes/followRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import statusRoutes from './routes/statusRoutes.js';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import anotherUserRoutes from './routes/anotherUserRoutes.js';
import aiResponseRoutes from './routes/aiRoutes.js';

const app = express();

// Middleware
app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// routes
app.use('/api/frontend',userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/post',postRoutes);
app.use('/api/post',likeRoutes);
app.use('/api/comment',commentRoutes);
app.use('/api/save',saveRoutes);
app.use('/api/follow',followRoutes);
app.use('/api/notification',notificationRoutes);
app.use('/api/status',statusRoutes);
app.use('/api/user',userRoutes);
app.use('/api/message',messageRoutes);
app.use('/api/conversation',conversationRoutes);
app.use('/api/anotherUser',anotherUserRoutes);
app.use('/api/ai',aiResponseRoutes);



const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});