import { Request, Response, NextFunction } from "express";
import config from "../config";
import SelOAuthClient from "@koompi/oauth";

const client = new SelOAuthClient({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    redirectUri: config.redirectUri,
});

export class UserController {
    static async userProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { access_token } = req.headers;

        if (!access_token) {
            res.status(401).json({ error: "No access token provided" });
        }

        try {
            const userProfile = await client.getUserProfile({
                accessToken: access_token as string,
                clientSecret: process.env.CLIENT_SECRET!,
            });
            res.json(userProfile);
        } catch (error) {
            res.status(401).json({ error: "Invalid or expired token" });
        }
    }
}
