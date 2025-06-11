import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();

router.get("/profile", UserController.userProfile);

export default router;
