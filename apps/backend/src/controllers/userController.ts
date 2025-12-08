import { Request, Response } from 'express';
import { UserService } from '../services/userService.js';

/**
 * User Controller
 * Handles HTTP requests for user-related operations
 */

/**
 * Get authenticated user's profile
 * @route GET /api/auth/me
 * @middleware authenticate
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.oauthUser?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await UserService.getUserById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Return formatted user data
    res.json({
      user: UserService.formatUserResponse(user),
    });
  } catch (error) {
    console.error('[User] Get profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
