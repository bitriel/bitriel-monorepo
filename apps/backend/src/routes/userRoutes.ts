import { Router } from "express";
import { getProfile } from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Get authenticated user profile
router.get("/me", authenticate, getProfile);

export default router;
