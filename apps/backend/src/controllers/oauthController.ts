import { Request, Response } from "express";
import { KoompiAuth } from "@koompi/oauth";
import { config } from "../config.js";
import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import { isOAuthUserResponse } from "../types/oauth.js";

// Initialize Koompi OAuth client
const koompiAuth = new KoompiAuth({
    clientId: config.koompi.clientId,
    clientSecret: config.koompi.clientSecret,
    redirectUri: config.koompi.redirectUri,
});

/**
 * Initiates the OAuth login flow by redirecting to Koompi OAuth
 */
export const login = async (_req: Request, res: Response): Promise<void> => {
    try {
        // Create authorization URL with PKCE
        const authorizeUrl = await koompiAuth.createLoginUrl();

        console.log("Redirecting to Koompi OAuth URL:", authorizeUrl);

        // Redirect user to Koompi OAuth
        res.redirect(authorizeUrl);
    } catch (error) {
        console.error("OAuth login error:", error);
        res.status(500).json({ error: "Failed to initiate OAuth login" });
    }
};

/**
 * Handles OAuth callback and exchanges code for tokens
 */
export const callback = async (req: Request, res: Response): Promise<void> => {
    try {
        const { code, state } = req.query;

        if (!code || typeof code !== "string") {
            res.status(400).json({ error: "Authorization code is required" });
            return;
        }

        // Exchange authorization code for access token
        const tokenResponse = await koompiAuth.exchangeCode({
            code,
            state: state as string,
        });

        // Get user info from Koompi
        const koompiResponse = await koompiAuth.getUserInfo(
            tokenResponse.access_token
        );

        // Log the user info to see the structure
        console.log(
            "Koompi User Info:",
            JSON.stringify(koompiResponse, null, 2)
        );

        // Validate response structure
        if (!isOAuthUserResponse(koompiResponse)) {
            throw new Error("Invalid user info response from Koompi OAuth");
        }

        // Extract user data from response
        const userData = koompiResponse.user;

        // Find or create user in database by userId
        let user = await User.findOne({ userId: userData._id });

        if (!user) {
            // Create new user from OAuth data - store actual values (including empty strings/null)
            user = new User({
                userId: userData._id,
                name:
                    userData.fullname !== undefined
                        ? userData.fullname
                        : undefined,
                firstName:
                    userData.first_name !== undefined
                        ? userData.first_name
                        : undefined,
                lastName:
                    userData.last_name !== undefined
                        ? userData.last_name
                        : undefined,
                username:
                    userData.username !== undefined
                        ? userData.username
                        : undefined,
                profile:
                    userData.profile !== undefined
                        ? userData.profile
                        : undefined,
                email:
                    userData.email !== undefined ? userData.email : undefined,
                phone:
                    userData.phone !== undefined ? userData.phone : undefined,
                telegramId:
                    userData.telegram_id !== undefined
                        ? userData.telegram_id
                        : undefined,
                walletAddress:
                    userData.wallet_address !== undefined
                        ? userData.wallet_address
                        : undefined,
            });
            await user.save();
        } else {
            // Update existing user with Koompi OAuth data
            user.userId = userData._id;

            // Update fields based on what's available (respecting scope permissions)
            if (userData.fullname !== undefined) user.name = userData.fullname;
            if (userData.first_name !== undefined)
                user.firstName = userData.first_name;
            if (userData.last_name !== undefined)
                user.lastName = userData.last_name;
            if (userData.username !== undefined)
                user.username = userData.username;
            if (userData.profile !== undefined) user.profile = userData.profile;
            if (userData.email !== undefined) user.email = userData.email;
            if (userData.phone !== undefined) user.phone = userData.phone;
            if (userData.telegram_id !== undefined)
                user.telegramId = userData.telegram_id;
            if (userData.wallet_address !== undefined)
                user.walletAddress = userData.wallet_address;

            await user.save();
        }

        // Generate JWT token for our app
        const token = generateToken(
            {
                userId: String(user._id),
            },
            config.jwt.secret,
            config.jwt.expiresIn
        );

        // Redirect to frontend with token
        const frontendCallbackUrl = `${config.frontend.url}${config.frontend.callbackPath}?token=${token}`;
        res.redirect(frontendCallbackUrl);
    } catch (error) {
        console.error("OAuth callback error:", error);

        // Redirect to frontend with error
        const errorMessage = encodeURIComponent("OAuth authentication failed");
        const frontendCallbackUrl = `${config.frontend.url}${config.frontend.callbackPath}?error=${errorMessage}`;
        res.redirect(frontendCallbackUrl);
    }
};
