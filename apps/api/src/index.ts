import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import session from "express-session";
import axios from "axios";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET || "your-session-secret",
        resave: false,
        saveUninitialized: false,
    }) as any
);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
    res.json({
        status: "ok",
        session: req.session.id ? "active" : "inactive",
    });
});

// Callback handler - receives access_token directly
app.get("/auth/callback", async (req, res) => {
    const { access_token } = req.query;

    if (!access_token) {
        console.error("No access token received");
        return res.redirect("/login?error=no_token");
    }

    try {
        // Get user information using the access token
        const userResponse = await axios.post(
            "https://oauth.koompi.org/v1/user/me",
            {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
            },
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("access_token", access_token);
        console.log("userresponse", userResponse);
        console.log("userResponse.data", userResponse.data);

        // const userData = userResponse.data;

        // // Store user session
        // req.session.user = userData;
        // req.session.token = access_token;

        // Redirect to dashboard or success page
        // res.redirect("/dashboard");
    } catch (error) {
        console.error("User profile fetch failed:", error);
        res.redirect("/login?error=profile_fetch_failed");
    }
});

// Protected route example
// app.get("/dashboard", (req, res) => {
//     if (!req.session.token) {
//         return res.redirect("/login");
//     }

//     res.json({
//         message: "Welcome to dashboard",
//         user: req.session.user,
//     });
// });

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
