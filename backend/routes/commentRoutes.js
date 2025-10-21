import express from "express";
import { createComment, deleteComment, getAllcomments } from "../controllers/commentControllers.js";
import protectedRoutes from "../middlewares/protectedRoutes.js";

const router = express.Router();

router.post('/create/:postId',protectedRoutes , createComment);
router.get('/getAllcomments/:postId',getAllcomments);
router.delete('/deleteComment/:commentId',protectedRoutes, deleteComment);

export default router;