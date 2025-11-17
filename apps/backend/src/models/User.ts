import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    email?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    profile?: string;
    phone?: string;
    telegramId?: number;
    walletAddress?: string;
    userId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: false,
            trim: true,
        },
        firstName: {
            type: String,
            required: false,
            trim: true,
        },
        lastName: {
            type: String,
            required: false,
            trim: true,
        },
        username: {
            type: String,
            required: false,
            trim: true,
        },
        profile: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: false,
            sparse: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: false,
        },
        telegramId: {
            type: Number,
            required: false,
        },
        walletAddress: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model<IUser>("User", userSchema);
