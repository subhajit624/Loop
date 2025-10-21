import express from 'express';
import { login, loginwithgoogle, logout, register } from '../controllers/authControllers.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/loginwithgoogle', loginwithgoogle);
router.post('/logout', logout);

export default router;