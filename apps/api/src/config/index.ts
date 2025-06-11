import dotenv from "dotenv";

dotenv.config();

export interface Config {
    port: number;
    nodeEnv: string;
    mongoUri: string;
    clientId: string;
    clientSecret: string;
    useHttps: boolean;
    corsOrigin: string;
}

const config: Config = {
    port: parseInt(process.env.PORT || "3000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/bitriel",
    clientId: process.env.CLIENT_ID || "",
    clientSecret: process.env.CLIENT_SECRET || "",
    useHttps: process.env.USE_HTTPS === "true",
    corsOrigin: process.env.CORS_ORIGIN || "*",
};

export default config;
