import { KoompiAuth } from '@koompi/oauth';
import { config } from '../config.js';
import { User, IUser } from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { isOAuthUserResponse, OAuthUserData } from '../types/oauth.js';

/**
 * OAuth Service
 * Handles all OAuth-related business logic
 */
export class OAuthService {
  /**
   * Create OAuth client for specific platform
   */
  static createOAuthClient(isMobile: boolean): KoompiAuth {
    const redirectUri = isMobile
      ? config.koompi.mobileRedirectUri
      : config.koompi.redirectUri;

    return new KoompiAuth({
      clientId: config.koompi.clientId,
      clientSecret: config.koompi.clientSecret,
      redirectUri,
    });
  }

  /**
   * Generate authorization URL for OAuth login
   */
  static async createAuthorizationUrl(isMobile: boolean): Promise<string> {
    const oauthClient = this.createOAuthClient(isMobile);
    return await oauthClient.createLoginUrl({});
  }

  /**
   * Exchange authorization code for access token and fetch user info
   */
  static async exchangeCodeAndGetUser(
    code: string,
    state: string,
    isMobile: boolean
  ): Promise<{ user: IUser; token: string }> {
    const oauthClient = this.createOAuthClient(isMobile);

    // Exchange code for access token
    const tokenResponse = await oauthClient.exchangeCode({ code, state });

    // Get user info from OAuth provider
    const oauthUserResponse = await oauthClient.getUserInfo(tokenResponse.access_token);

    // Validate response structure
    if (!isOAuthUserResponse(oauthUserResponse)) {
      throw new Error('Invalid user info response from OAuth provider');
    }

    // Find or create user in database
    const user = await this.findOrCreateUser(oauthUserResponse.user);

    // Generate JWT token
    const jwtToken = generateToken(
      { userId: String(user._id) },
      config.jwt.secret,
      config.jwt.expiresIn
    );

    return { user, token: jwtToken };
  }

  /**
   * Find existing user or create new user from OAuth data
   */
  private static async findOrCreateUser(oauthData: OAuthUserData): Promise<IUser> {
    let user = await User.findOne({ userId: oauthData._id });

    if (!user) {
      // Create new user
      user = new User(this.mapOAuthDataToUser(oauthData));
      await user.save();
      console.log('Created new user:', user._id);
    } else {
      // Update existing user with latest OAuth data
      Object.assign(user, this.mapOAuthDataToUser(oauthData));
      await user.save();
      console.log('Updated existing user:', user._id);
    }

    return user;
  }

  /**
   * Map OAuth data to User model
   */
  private static mapOAuthDataToUser(oauthData: OAuthUserData): Partial<IUser> {
    return {
      userId: oauthData._id,
      name: oauthData.fullname !== undefined ? oauthData.fullname : undefined,
      firstName: oauthData.first_name !== undefined ? oauthData.first_name : undefined,
      lastName: oauthData.last_name !== undefined ? oauthData.last_name : undefined,
      username: oauthData.username !== undefined ? oauthData.username : undefined,
      profile: oauthData.profile !== undefined ? oauthData.profile : undefined,
      email: oauthData.email !== undefined ? oauthData.email : undefined,
      phone: oauthData.phone !== undefined ? oauthData.phone : undefined,
      telegramId: oauthData.telegram_id !== undefined ? oauthData.telegram_id : undefined,
      walletAddress: oauthData.wallet_address !== undefined ? oauthData.wallet_address : undefined,
    };
  }

  /**
   * Generate redirect URL for OAuth callback
   */
  static generateRedirectUrl(token: string, isMobile: boolean): string {
    if (isMobile) {
      return `bitriel://oauth/callback?token=${token}`;
    }
    return `${config.frontend.url}${config.frontend.callbackPath}?token=${token}`;
  }

  /**
   * Generate error redirect URL
   */
  static generateErrorRedirectUrl(errorMessage: string, isMobile: boolean): string {
    const encodedError = encodeURIComponent(errorMessage);

    if (isMobile) {
      return `bitriel://oauth/callback?error=${encodedError}`;
    }
    return `${config.frontend.url}${config.frontend.callbackPath}?error=${encodedError}`;
  }
}
