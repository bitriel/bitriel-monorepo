import { useAuthStore, User } from '@/store/authStore';

/**
 * User Hooks
 * Convenient hooks for accessing user data from auth store
 */

/**
 * Hook to access current user data from auth store
 * @returns User object or null if not authenticated
 */
export const useUser = (): User | null => {
  return useAuthStore((state) => state.user);
};

/**
 * Hook to get user display name
 * Prioritizes: firstName > name > username > email (local part) > 'Guest'
 * @returns Formatted display name
 */
export const useUserDisplayName = (): string => {
  const user = useUser();

  if (!user) return 'Guest';

  // Priority order for display name
  if (user.firstName) return user.firstName;
  if (user.name) return user.name;
  if (user.username) return user.username;
  if (user.email) return user.email.split('@')[0];

  return 'User';
};

/**
 * Hook to get full user name
 * Combines firstName and lastName if both available
 * @returns Full name or fallback to display name
 */
export const useUserFullName = (): string => {
  const user = useUser();
  const displayName = useUserDisplayName();

  if (!user) return displayName;

  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  return user.name || displayName;
};

/**
 * Hook to check if user has wallet address configured
 * @returns true if wallet address exists
 */
export const useHasWallet = (): boolean => {
  const user = useUser();
  return !!user?.walletAddress;
};

/**
 * Hook to check if user has verified email
 * @returns true if email exists
 */
export const useHasEmail = (): boolean => {
  const user = useUser();
  return !!user?.email;
};

/**
 * Hook to check if user has phone number
 * @returns true if phone exists and not empty
 */
export const useHasPhone = (): boolean => {
  const user = useUser();
  return !!user?.phone && user.phone.length > 0;
};
