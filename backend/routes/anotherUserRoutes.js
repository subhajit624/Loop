import express from 'express';
import { anotherUserProfile } from '../controllers/anotherUserProfileControlers.js';

const router = express.Router();

router.get('/:anotherUserId',anotherUserProfile);

export default router;