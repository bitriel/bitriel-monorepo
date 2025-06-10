import { User, IUser } from "../models/User";
import { UserProfile } from "@koompi/oauth";

export class UserService {
    static async createOrUpdateUser(userData: UserProfile): Promise<IUser> {
        try {
            // Use findOneAndUpdate with upsert to either update existing user or create new one
            const user = await User.findOneAndUpdate(
                { _id: userData._id }, // Find by _id
                {
                    $set: {
                        ...userData,
                        // Ensure _id is set correctly
                        _id: userData._id,
                    },
                },
                {
                    new: true, // Return the updated document
                    upsert: true, // Create if doesn't exist
                    runValidators: true, // Run schema validations
                }
            );

            return user;
        } catch (error) {
            console.error("Error creating/updating user:", error);
            throw new Error("Failed to save user data");
        }
    }

    static async getUserById(userId: string): Promise<IUser | null> {
        try {
            return await User.findById(userId);
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            throw new Error("Failed to fetch user");
        }
    }

    static async getUserByEmail(email: string): Promise<IUser | null> {
        try {
            return await User.findOne({ email });
        } catch (error) {
            console.error("Error fetching user by email:", error);
            throw new Error("Failed to fetch user");
        }
    }
}
