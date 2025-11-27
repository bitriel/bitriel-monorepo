import { Router } from "express";
import { getConfig, callback, mobileCallback } from "../controllers/oauthController.js";

const router = Router();

// OAuth config - returns OAuth configuration for clients to build authorization URL
router.get("/config", getConfig);

// OAuth callback - handles code exchange and user creation (web)
router.get("/callback", callback);

// OAuth callback - handles code exchange and user creation (mobile)
router.get("/callback-mobile", mobileCallback);

export default router;
