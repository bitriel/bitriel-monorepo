import mongoose from "mongoose";
import config from "../config";

export const connectToDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(config.mongoUri);

        console.log("✅ Connected to MongoDB successfully");

        // Handle connection events
        mongoose.connection.on("error", error => {
            console.error("❌ MongoDB connection error:", error);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB disconnected");
        });

        mongoose.connection.on("reconnected", () => {
            console.log("✅ MongoDB reconnected");
        });
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};

export const disconnectFromDatabase = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        console.log("✅ Disconnected from MongoDB");
    } catch (error) {
        console.error("❌ MongoDB disconnection error:", error);
    }
};
