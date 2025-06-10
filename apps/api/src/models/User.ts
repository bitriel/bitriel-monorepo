import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    _id: string;
    fullname?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    profile?: string;
    telegram_id?: string | number;
    wallet_address?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        fullname: {
            type: String,
            trim: true,
        },
        first_name: {
            type: String,
            trim: true,
        },
        last_name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        profile: {
            type: String,
            trim: true,
        },
        telegram_id: {
            type: Schema.Types.Mixed,
        },
        wallet_address: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const User = mongoose.model<IUser>("User", UserSchema);
