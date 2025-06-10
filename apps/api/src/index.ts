import express from "express";
import dotenv from "dotenv";
import { SelOAuthClient } from "@koompi/oauth";
import cors from "cors";
import https from "https";
import fs from "fs";

import { connectToDatabase } from "./utils/database";
import { UserService } from "./services/userService";
import path from "path";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

const client = new SelOAuthClient({
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
});

// Connect to MongoDB when the server starts
connectToDatabase();

app.get("/auth/login", (req, res) => {
    const authUrl = client.getAuthorizeUrl({
        redirectUri: `${req.protocol}://${req.get("host")}/auth/callback`,
        state: crypto.randomUUID(), // Generate random state instead of using session
    });

    res.redirect(authUrl);
});

app.get("/auth/callback", async (req, res) => {
    try {
        const { access_token, state } = req.query;
        // Since we're not using sessions, we can't verify against req.session.csrfToken
        // Instead, we should verify the state parameter exists
        if (!state) {
            return res.status(400).send("Missing state parameter");
        }

        if (!access_token) {
            return res.status(400).send("Missing access token");
        }

        const result = await client.getUserProfile(access_token as string);

        // Save or update user data in MongoDB
        try {
            const savedUser = await UserService.createOrUpdateUser(result.user);
            console.log("✅ User data saved to MongoDB:", savedUser._id);

            // Return the same response format but with saved user data
            res.json({
                success: true,
                user: savedUser,
                message: "Authentication successful",
            });
        } catch (dbError) {
            console.error("❌ Database error:", dbError);
            // Still return success for OAuth but log the database error
            res.json({
                success: true,
                user: result.user,
                message: "Authentication successful, but user data not saved to database",
                warning: "Database save failed",
            });
        }
    } catch (error) {
        console.error("OAuth callback error:", error);
        res.status(500).send("Authentication failed");
    }
});

const useHttps = process.env.USE_HTTPS === "true";

if (useHttps) {
    const httpsOptions = {
        key: fs.readFileSync(path.join(__dirname, "../../../certs/localhost+2-key.pem")),
        cert: fs.readFileSync(path.join(__dirname, "../../../certs/localhost+2.pem")),
    };

    https.createServer(httpsOptions, app).listen(port, () => {
        console.log(`Server is running on https://localhost:${port}`);
    });
} else {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}
