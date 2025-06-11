import { Request, Response, NextFunction } from "express";
import { SelOAuthClient } from "@koompi/oauth";
import { UserService } from "../services/userService";
import { HTTP_STATUS, MessageBuilder } from "../constants";
import { ApiResponse } from "../types";
import { AppError } from "../middleware/errorHandler";
import config from "../config";

const client = new SelOAuthClient({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    redirectUri: config.redirectUri,
});

export class AuthController {
    static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authUrl = client.getLoginUrl();

            res.redirect(authUrl);
        } catch (error) {
            next(new AppError(MessageBuilder.build("AUTH_FAILED"), HTTP_STATUS.INTERNAL_SERVER_ERROR));
        }
    }

    static async callback(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { access_token, state } = req.query;

            if (!state) {
                throw new AppError(MessageBuilder.build("MISSING_STATE_PARAMETER"), HTTP_STATUS.BAD_REQUEST);
            }

            if (!access_token) {
                throw new AppError(MessageBuilder.build("MISSING_ACCESS_TOKEN"), HTTP_STATUS.BAD_REQUEST);
            }

            const result = await client.getUserProfile(access_token as string);

            try {
                const savedUser = await UserService.createOrUpdateUser(result.user);
                console.log("✅ User data saved to MongoDB:", savedUser._id);

                const response: ApiResponse = {
                    success: true,
                    data: savedUser,
                    message: MessageBuilder.build("AUTH_SUCCESS"),
                };

                res.status(HTTP_STATUS.OK).json(response);
            } catch (dbError) {
                console.error("❌ Database error:", dbError);

                const response: ApiResponse = {
                    success: true,
                    data: result.user,
                    message: MessageBuilder.build("AUTH_SUCCESS"),
                    warning: MessageBuilder.build("DB_SAVE_FAILED"),
                };

                res.status(HTTP_STATUS.OK).json(response);
            }
        } catch (error) {
            console.error("OAuth callback error:", error);
            if (error instanceof AppError) {
                next(error);
            } else {
                next(new AppError(MessageBuilder.build("AUTH_FAILED"), HTTP_STATUS.INTERNAL_SERVER_ERROR));
            }
        }
    }
}
