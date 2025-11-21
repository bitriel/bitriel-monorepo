import { Router } from "express";
import { login, callback, mobileCallback } from "../controllers/oauthController.js";

const router = Router();

// OAuth login - redirects to Koompi OAuth
router.get("/login", login);

// OAuth callback - handles code exchange and user creation (web)
router.get("/callback", callback);

// OAuth callback - handles code exchange and user creation (mobile)
router.get("/callback-mobile", mobileCallback);

export default router;
