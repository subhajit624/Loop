import express from 'express';
import protectedRoutes from '../middlewares/protectedRoutes.js';
import { getAllConversationsUsers, getOrCreateConversation } from '../controllers/conversionControllers.js';

const router = express.Router();

router.get('/getOrCreateConversation/:receiverId', protectedRoutes , getOrCreateConversation);
router.get('/getAllConversationsUsers', protectedRoutes , getAllConversationsUsers);

export default router;
