export interface OAuthUserData {
    _id: string;
    fullname: string;
    first_name: string;
    last_name: string;
    username: string;
    profile: string;
    email?: string;
    phone?: string;
    telegram_id?: number;
    wallet_address?: string;
    created_at: string;
    updated_at: string;
}

export interface OAuthUserResponse {
    user: OAuthUserData;
    scopes: string[];
    status: string;
}

/**
 * Type guard to check if the response is a valid OAuthUserResponse
 */
export function isOAuthUserResponse(
    response: unknown
): response is OAuthUserResponse {
    if (typeof response !== "object" || response === null) {
        return false;
    }

    const obj = response as Record<string, unknown>;

    return (
        typeof obj.status === "string" &&
        typeof obj.user === "object" &&
        obj.user !== null &&
        typeof (obj.user as Record<string, unknown>)._id === "string" &&
        typeof (obj.user as Record<string, unknown>).username === "string"
    );
}
