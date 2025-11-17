import { Router } from "express";
import { login, callback } from "../controllers/oauthController.js";

const router = Router();

// OAuth login - redirects to Koompi OAuth
router.get("/login", login);

// OAuth callback - handles code exchange and user creation
router.get("/callback", callback);

export default router;
