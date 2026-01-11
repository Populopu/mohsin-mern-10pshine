import express from "express";
import { getNotes } from "../controllers/notesControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getNotes);

export default router;
