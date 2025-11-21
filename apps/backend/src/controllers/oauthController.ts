import { Request, Response } from 'express';
import { OAuthService } from '../services/oauthService.js';

/**
 * OAuth Controller
 * Handles HTTP requests for OAuth authentication flow
 */

/**
 * Initiates the OAuth login flow by redirecting to Koompi OAuth
 * @route GET /api/oauth/login?platform=mobile|web
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const platform = req.query.platform as string;
    const isMobile = platform === 'mobile';

    // Generate authorization URL
    const authorizeUrl = await OAuthService.createAuthorizationUrl(isMobile);

    console.log(`[OAuth] Initiating login for ${platform || 'web'} platform`);
    console.log(`[OAuth] Redirect URL: ${authorizeUrl}`);

    res.redirect(authorizeUrl);
  } catch (error) {
    console.error('[OAuth] Login error:', error);
    res.status(500).json({
      error: 'Failed to initiate OAuth login',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Handles OAuth callback for web platform
 * @route GET /api/oauth/callback
 */
export const callback = async (req: Request, res: Response): Promise<void> => {
  await handleOAuthCallback(req, res, false);
};

/**
 * Handles OAuth callback for mobile platform
 * @route GET /api/oauth/callback-mobile
 */
export const mobileCallback = async (req: Request, res: Response): Promise<void> => {
  await handleOAuthCallback(req, res, true);
};

/**
 * Shared callback handler for both web and mobile platforms
 */
const handleOAuthCallback = async (
  req: Request,
  res: Response,
  isMobile: boolean
): Promise<void> => {
  const { code, state } = req.query;
  const platform = isMobile ? 'mobile' : 'web';

  try {
    // Validate required parameters
    if (!code || typeof code !== 'string') {
      throw new Error('Authorization code is required');
    }

    console.log(`[OAuth] Processing callback for ${platform} platform`);

    // Exchange code for token and get user data
    const { user, token } = await OAuthService.exchangeCodeAndGetUser(
      code,
      state as string,
      isMobile
    );

    console.log(`[OAuth] User authenticated successfully:`, {
      userId: user._id,
      username: user.username,
      email: user.email,
    });

    // Generate redirect URL with token
    const redirectUrl = OAuthService.generateRedirectUrl(token, isMobile);

    console.log(`[OAuth] Redirecting to: ${redirectUrl}`);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error(`[OAuth] Callback error for ${platform}:`, error);

    // Generate error redirect URL
    const errorMessage = error instanceof Error ? error.message : 'OAuth authentication failed';
    const redirectUrl = OAuthService.generateErrorRedirectUrl(errorMessage, isMobile);

    res.redirect(redirectUrl);
  }
};
