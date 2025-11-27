import { Request, Response } from 'express';
import { OAuthService } from '../services/oauthService.js';
import { config } from '../config.js';

/**
 * OAuth Controller
 * Handles HTTP requests for OAuth authentication flow
 *
 * Standard OAuth 2.0 Authorization Code Flow:
 * 1. Client (mobile/web) opens OAuth URL directly (no /login endpoint needed)
 * 2. OAuth server redirects to callback endpoints below with authorization code
 * 3. Backend exchanges code for token and creates user session
 */

/**
 * Get OAuth configuration for clients to build authorization URL
 * @route GET /api/oauth/config?platform=mobile|web
 */
export const getConfig = (req: Request, res: Response): void => {
  const platform = req.query.platform as string;
  const isMobile = platform === 'mobile';

  const redirectUri = isMobile
    ? config.koompi.mobileRedirectUri
    : config.koompi.redirectUri;

  res.json({
    authUrl: 'https://oauth.koompi.org/v1/oauth',
    clientId: config.koompi.clientId,
    redirectUri,
    scope: 'profile.basic profile.contact wallet.read',
  });
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
