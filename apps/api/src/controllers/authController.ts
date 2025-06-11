import { Request, Response, NextFunction } from "express";
import { SelOAuthClient } from "@koompi/oauth";
import { UserService } from "../services/userService";
import { OAuthSessionService } from "../services/oauthSessionService";
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
            // Extract redirect schema from query parameters
            const { schema } = req.query;

            const authUrl = client.getLoginUrl();

            // If mobile app schema is provided, store it with a session ID
            if (schema) {
                // Create a new OAuth session for mobile redirect
                const sessionId = OAuthSessionService.createSession(schema as string);

                // Append session ID to the auth URL as a custom parameter
                const urlObj = new URL(authUrl);
                urlObj.searchParams.set("mobile_session", sessionId);

                res.redirect(urlObj.toString());
            } else {
                res.redirect(authUrl);
            }
        } catch (error) {
            next(new AppError(MessageBuilder.build("AUTH_FAILED"), HTTP_STATUS.INTERNAL_SERVER_ERROR));
        }
    }

    static async callback(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { access_token, mobile_session } = req.query;

            // Check if there's a mobile app redirect schema
            const redirectSchema = mobile_session
                ? OAuthSessionService.getSchemaForSession(mobile_session as string)
                : null;

            if (!access_token) {
                if (redirectSchema) {
                    return AuthController.redirectToMobileApp(res, redirectSchema, {
                        success: false,
                        error: MessageBuilder.build("MISSING_ACCESS_TOKEN"),
                    });
                }
                throw new AppError(MessageBuilder.build("MISSING_ACCESS_TOKEN"), HTTP_STATUS.BAD_REQUEST);
            }

            const userProfile = await client.getUserProfile({
                accessToken: access_token as string,
                clientSecret: config.clientSecret,
            });

            try {
                const savedUser = await UserService.createOrUpdateUser(userProfile.user);
                console.log("✅ User data saved to MongoDB:", savedUser._id);

                // Clean up stored schema
                if (mobile_session) {
                    OAuthSessionService.removeSession(mobile_session as string);
                }

                const authData = {
                    success: true,
                    data: {
                        user: savedUser,
                        accessToken: access_token,
                    },
                    message: MessageBuilder.build("AUTH_SUCCESS"),
                };

                // Redirect to mobile app if schema is provided
                if (redirectSchema) {
                    return AuthController.redirectToMobileApp(res, redirectSchema, authData);
                }

                // Default JSON response for web clients
                res.status(HTTP_STATUS.OK).json(authData);
            } catch (dbError) {
                console.error("❌ Database error:", dbError);

                // Clean up stored schema
                if (mobile_session) {
                    OAuthSessionService.removeSession(mobile_session as string);
                }

                const authData = {
                    success: true,
                    data: {
                        user: userProfile.user,
                        accessToken: access_token,
                    },
                    message: MessageBuilder.build("AUTH_SUCCESS"),
                    warning: MessageBuilder.build("DB_SAVE_FAILED"),
                };

                // Redirect to mobile app if schema is provided
                if (redirectSchema) {
                    return AuthController.redirectToMobileApp(res, redirectSchema, authData);
                }

                // Default JSON response for web clients
                res.status(HTTP_STATUS.OK).json(authData);
            }
        } catch (error) {
            console.error("OAuth callback error:", error);

            const { mobile_session } = req.query;
            const redirectSchema = mobile_session
                ? OAuthSessionService.getSchemaForSession(mobile_session as string)
                : null;

            // Clean up stored schema
            if (mobile_session) {
                OAuthSessionService.removeSession(mobile_session as string);
            }

            if (redirectSchema) {
                return AuthController.redirectToMobileApp(res, redirectSchema, {
                    success: false,
                    error: MessageBuilder.build("AUTH_FAILED"),
                });
            }

            if (error instanceof AppError) {
                next(error);
            } else {
                next(new AppError(MessageBuilder.build("AUTH_FAILED"), HTTP_STATUS.INTERNAL_SERVER_ERROR));
            }
        }
    }

    /**
     * Redirect to mobile app with authentication data
     */
    private static redirectToMobileApp(res: Response, schema: string, data: any): void {
        try {
            // Create URL-safe base64 encoded data
            const encodedData = Buffer.from(JSON.stringify(data)).toString("base64url");

            // Construct the redirect URL
            const redirectUrl = `${schema}://auth/callback?data=${encodedData}`;

            console.log(`🔄 Redirecting to mobile app: ${schema}://auth/callback`);

            // For mobile apps, we need to redirect with 302 status
            res.redirect(302, redirectUrl);
        } catch (error) {
            console.error("❌ Mobile app redirect error:", error);

            // Fallback to simple redirect with minimal data
            const fallbackUrl = `${schema}://auth/callback?success=${data.success}&error=${encodeURIComponent(data.error || "")}`;
            res.redirect(302, fallbackUrl);
        }
    }

    /**
     * Get OAuth session statistics for monitoring
     */
    static async getSessionStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const stats = OAuthSessionService.getStats();

            const response: ApiResponse = {
                success: true,
                data: stats,
                message: "Session statistics retrieved successfully",
            };

            res.status(HTTP_STATUS.OK).json(response);
        } catch (error) {
            next(new AppError(MessageBuilder.build("INTERNAL_ERROR"), HTTP_STATUS.INTERNAL_SERVER_ERROR));
        }
    }
}
