import express from "express";
import multer from 'multer';
import protectedRoutes from "../middlewares/protectedRoutes.js";
import { sendMessage } from "../controllers/messageControllers.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/send/:receiverId', protectedRoutes,upload.single('image'), sendMessage);

export default router;