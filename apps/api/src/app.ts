import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";
import routes from "./routes";
import { requestLogger } from "./middleware/logger";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(
    cors({
        origin: config.corsOrigin,
        credentials: true,
    })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie parser for OAuth session tracking
app.use(cookieParser());

// Request logging
app.use(requestLogger);

// API routes
app.use("/", routes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
