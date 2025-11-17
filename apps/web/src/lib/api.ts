import type { UserProfileResponse } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const api = {
  getOAuthLoginUrl: () => {
    return `${API_BASE_URL}/api/oauth/login`;
  },

  getUserProfile: async (token: string): Promise<UserProfileResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  },
};
