import { Router } from "express";
import { AuthController } from "../controllers/authController";

const router = Router();

// GET /auth/login - Redirect to OAuth provider
router.get("/login", AuthController.login);

// GET /auth/callback - Handle OAuth callback
router.get("/callback", AuthController.callback);

export default router;
