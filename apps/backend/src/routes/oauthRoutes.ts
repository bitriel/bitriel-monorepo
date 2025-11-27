import { Router } from "express";
import { getConfig, callback } from "../controllers/oauthController.js";

const router = Router();

// OAuth login config - returns OAuth configuration for clients to build authorization URL
router.get("/login", getConfig);

// OAuth callback - handles code exchange and user creation (web)
router.get("/callback", callback);



export default router;
