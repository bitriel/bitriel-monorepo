export interface OAuthSession {
    sessionId: string;
    schema: string;
    createdAt: Date;
    expiresAt: Date;
}

/**
 * Service to manage OAuth sessions for mobile app redirects
 * In production, this should use Redis or a database instead of in-memory storage
 */
export class OAuthSessionService {
    private static sessions = new Map<string, OAuthSession>();
    private static readonly SESSION_DURATION = 10 * 60 * 1000; // 10 minutes

    /**
     * Create a new OAuth session for mobile app redirect
     */
    static createSession(schema: string): string {
        const sessionId = this.generateSessionId();
        const now = new Date();
        const session: OAuthSession = {
            sessionId,
            schema,
            createdAt: now,
            expiresAt: new Date(now.getTime() + this.SESSION_DURATION),
        };

        this.sessions.set(sessionId, session);
        this.cleanupExpiredSessions();

        console.log(`📱 Created mobile OAuth session: ${sessionId} for schema: ${schema}`);
        return sessionId;
    }

    /**
     * Retrieve and validate an OAuth session
     */
    static getSession(sessionId: string): OAuthSession | null {
        const session = this.sessions.get(sessionId);

        if (!session) {
            return null;
        }

        // Check if session has expired
        if (new Date() > session.expiresAt) {
            this.sessions.delete(sessionId);
            console.log(`⏰ OAuth session expired: ${sessionId}`);
            return null;
        }

        return session;
    }

    /**
     * Remove an OAuth session (cleanup after use)
     */
    static removeSession(sessionId: string): void {
        const removed = this.sessions.delete(sessionId);
        if (removed) {
            console.log(`🗑️ Removed OAuth session: ${sessionId}`);
        }
    }

    /**
     * Get the mobile app schema for a session
     */
    static getSchemaForSession(sessionId: string): string | null {
        const session = this.getSession(sessionId);
        return session ? session.schema : null;
    }

    /**
     * Clean up expired sessions
     */
    private static cleanupExpiredSessions(): void {
        const now = new Date();
        let cleanedCount = 0;

        for (const [sessionId, session] of this.sessions.entries()) {
            if (now > session.expiresAt) {
                this.sessions.delete(sessionId);
                cleanedCount++;
            }
        }

        if (cleanedCount > 0) {
            console.log(`🧹 Cleaned up ${cleanedCount} expired OAuth sessions`);
        }
    }

    /**
     * Generate a secure session ID
     */
    private static generateSessionId(): string {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < 32; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Get session statistics (for monitoring)
     */
    static getStats(): {
        totalSessions: number;
        activeSessions: number;
        sessions: Array<{ sessionId: string; schema: string; createdAt: Date; expiresAt: Date }>;
    } {
        const now = new Date();
        let activeSessions = 0;
        const sessionDetails: Array<{ sessionId: string; schema: string; createdAt: Date; expiresAt: Date }> = [];

        for (const session of this.sessions.values()) {
            sessionDetails.push({
                sessionId: session.sessionId,
                schema: session.schema,
                createdAt: session.createdAt,
                expiresAt: session.expiresAt,
            });

            if (now <= session.expiresAt) {
                activeSessions++;
            }
        }

        return {
            totalSessions: this.sessions.size,
            activeSessions,
            sessions: sessionDetails,
        };
    }
}
