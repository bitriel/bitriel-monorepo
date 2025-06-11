import https from "https";
import fs from "fs";
import path from "path";
import app from "./app";
import config from "./config";
import { connectToDatabase } from "./utils/database";
import { CERT_PATHS } from "./constants";

const startServer = async (): Promise<void> => {
    try {
        // Connect to database
        await connectToDatabase();

        if (config.useHttps) {
            const httpsOptions = {
                key: fs.readFileSync(path.join(__dirname, CERT_PATHS.KEY)),
                cert: fs.readFileSync(path.join(__dirname, CERT_PATHS.CERT)),
            };

            https.createServer(httpsOptions, app).listen(config.port, () => {
                console.log(`🚀 HTTPS Server running on https://localhost:${config.port}`);
                console.log(`📊 Environment: ${config.nodeEnv}`);
            });
        } else {
            app.listen(config.port, () => {
                console.log(`🚀 HTTP Server running on http://localhost:${config.port}`);
                console.log(`📊 Environment: ${config.nodeEnv}`);
            });
        }
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

// Handle graceful shutdown
const gracefulShutdown = (signal: string) => {
    console.log(`\n📡 Received ${signal}. Starting graceful shutdown...`);

    // Add cleanup logic here (close DB connections, finish ongoing requests, etc.)
    process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Start the server
startServer();
