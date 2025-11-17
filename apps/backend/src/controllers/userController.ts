import { Request, Response } from "express";
import { User } from "../models/User.js";

export const getProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.oauthUser?.userId;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.json({
            user: {
                id: String(user._id),
                userId: user.userId,
                name: user.name,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                profile: user.profile,
                email: user.email,
                phone: user.phone,
                telegramId: user.telegramId,
                walletAddress: user.walletAddress,
            },
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
