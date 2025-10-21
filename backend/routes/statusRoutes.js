import express from 'express';
import multer from 'multer';
import protectedRoutes from '../middlewares/protectedRoutes.js';
import { createImageStatus, createVideoStatus, getAllStatus, getStatus } from '../controllers/statusControllers.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/createImage',protectedRoutes ,upload.single('image') ,createImageStatus);
router.post('/createVideo',protectedRoutes ,upload.single('video') ,createVideoStatus);
router.get('/getAllStatus', getAllStatus);
router.get('/getStatus/:statusId', getStatus);

export default router;