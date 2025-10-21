import express from 'express';
import protectedRoutes from '../middlewares/protectedRoutes.js';
import { getNotifications, notificationMarkAsRead } from '../controllers/notificationControllers.js';

const router = express.Router();

router.get('/getAllNotifications',protectedRoutes , getNotifications);
router.post('/markAsRead/:notificationId', protectedRoutes, notificationMarkAsRead);

export default router;