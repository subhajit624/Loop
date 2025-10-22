import express from 'express';
import protectedRoutes from '../middlewares/protectedRoutes.js';
import { follow } from '../controllers/followControllers.js';

const router = express.Router();

router.post('/:anotherUserId',protectedRoutes , follow);

export default router;