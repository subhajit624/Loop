import express from "express";
import protectedRoutes from "../middlewares/protectedRoutes.js";
import { getAllLikedUsers, likePost } from "../controllers/likeControllers.js";

const router = express.Router();

router.post('/like/:postId',protectedRoutes ,likePost);
router.get('/like/users/:postId', getAllLikedUsers);

export default router;