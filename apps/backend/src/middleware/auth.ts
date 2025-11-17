import { Request, Response, NextFunction } from "express";
import { verifyToken, JWTPayload } from "../utils/jwt.js";
import { config } from "../config.js";

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            oauthUser?: JWTPayload;
        }
    }
}

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ error: "No token provided" });
            return;
        }

        const token = authHeader.substring(7);

        const decoded = verifyToken(token, config.jwt.secret);
        req.oauthUser = decoded;

        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid or expired token" });
        return;
    }
};
