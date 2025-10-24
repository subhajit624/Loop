import express from 'express';
import multer from 'multer';
import { changeAvatar, changeBio, getAllLoggedInUsers } from '../controllers/userControllers.js';
import protectedRoutes from '../middlewares/protectedRoutes.js';
import { loginUserdata } from '../controllers/loginUserData.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put('/changeAvatar',protectedRoutes,upload.single('image') ,changeAvatar);
router.put('/changeBio', protectedRoutes, changeBio);
router.get('/getAllLoggedInUsers', getAllLoggedInUsers);
router.get('/me', protectedRoutes, loginUserdata);

export default router;
