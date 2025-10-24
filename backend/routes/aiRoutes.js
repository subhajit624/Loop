import express from "express";
import { aiResponse } from "../controllers/aiResponseControllers.js";

const router = express.Router();

router.post('/response', aiResponse);

export default router;