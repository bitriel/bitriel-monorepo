import { User, IUser } from '../models/User.js';

/**
 * User Service
 * Handles all user-related business logic
 */
export class UserService {
  /**
   * Get user by MongoDB ID
   */
  static async getUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  /**
   * Get user by Koompi OAuth user ID
   */
  static async getUserByOAuthId(oauthUserId: string): Promise<IUser | null> {
    return await User.findOne({ userId: oauthUserId });
  }

  /**
   * Format user data for API response (exclude sensitive fields)
   */
  static formatUserResponse(user: IUser) {
    return {
      id: String(user._id),
      userId: user.userId,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      profile: user.profile,
      email: user.email,
      phone: user.phone,
      telegramId: user.telegramId,
      walletAddress: user.walletAddress,
    };
  }
}
