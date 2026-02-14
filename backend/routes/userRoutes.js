import express from "express";
import { changePassword, getProfile } from "../controllers/userControllers.js";
import {protect} from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";
import { updateProfilePic } from "../controllers/userControllers.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/avatar", protect, upload.single("image"), updateProfilePic);
router.put("/change-password", protect, changePassword);

export default router;
