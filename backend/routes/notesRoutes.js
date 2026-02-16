import express from "express";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  togglePin
} from "../controllers/notesControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getNotes);
router.post("/", protect, createNote);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);

router.patch("/:id/pin", protect, togglePin);


export default router;
