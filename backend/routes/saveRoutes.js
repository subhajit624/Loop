import express from 'express';
import { savePost, showAllSavedPosts } from '../controllers/saveControllers.js';
import protectedRoutes from '../middlewares/protectedRoutes.js';

const router = express.Router();

router.post('/:postId', protectedRoutes, savePost);
router.get('/showAllSavedPosts',protectedRoutes ,showAllSavedPosts);

export default router;