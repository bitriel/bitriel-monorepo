export const API_CONFIG = {
    // Base URLs
    BASE_URL: "https://api.bitriel.com", // Always use production API for OAuth

    // OAuth endpoints
    AUTH: {
        LOGIN: "/auth/login",
        CALLBACK: "/auth/callback",
        SESSIONS: "/auth/sessions",
    },

    // User endpoints
    USER: {
        PROFILE: "/user/profile",
    },

    // App configuration
    APP: {
        URL_SCHEME: "bitrielwallet",
        REDIRECT_PATH: "auth/callback",
    },

    // Timeouts
    TIMEOUT: {
        DEFAULT: 10000, // 10 seconds
        AUTH: 30000, // 30 seconds for auth operations
    },
};

export const getApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const getAuthUrl = (schema?: string): string => {
    const baseUrl = getApiUrl(API_CONFIG.AUTH.LOGIN);
    return schema ? `${baseUrl}?schema=${schema}` : baseUrl;
};

export const getRedirectUri = (): string => {
    return `${API_CONFIG.APP.URL_SCHEME}://${API_CONFIG.APP.REDIRECT_PATH}`;
};
