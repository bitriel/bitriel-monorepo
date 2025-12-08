import { User, GetProfileResponse, APIError } from '@/types/auth';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:4000';

/**
 * User API Service
 * Handles all user-related API calls
 */

/**
 * Fetch the authenticated user's profile from the backend
 * @param token - JWT authentication token
 * @returns User profile data
 * @throws Error if the request fails
 */
export const getUserProfile = async (token: string): Promise<User> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData: APIError = await response.json().catch(() => ({
        error: 'Unknown error',
      }));
      throw new Error(errorData.error || `Failed to fetch user profile: ${response.status}`);
    }

    const data: GetProfileResponse = await response.json();
    return data.user;
  } catch (error) {
    console.error('[UserService] Get profile error:', error);
    throw error;
  }
};
