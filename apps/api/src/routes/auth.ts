import { Router } from "express";
import { AuthController } from "../controllers/authController";

const router = Router();

// GET /auth/login - Redirect to OAuth provider
router.get("/login", AuthController.login);

// GET /auth/callback - Handle OAuth callback
router.get("/callback", AuthController.callback);

// GET /auth/sessions - Get OAuth session statistics (for monitoring)
router.get("/sessions", AuthController.getSessionStats);

export default router;
