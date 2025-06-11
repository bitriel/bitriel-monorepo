export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
} as const;

// Message types for better organization and type safety
export enum MessageType {
    SUCCESS = "success",
    ERROR = "error",
    WARNING = "warning",
    INFO = "info",
}

// Message categories for better organization
export enum MessageCategory {
    AUTH = "auth",
    USER = "user",
    DATABASE = "database",
    VALIDATION = "validation",
    SYSTEM = "system",
}

// Base message interface
export interface Message {
    type: MessageType;
    category: MessageCategory;
    code: string;
    template: string;
}

// Message registry with organized structure
export const MESSAGES: Record<string, Message> = {
    // Authentication messages
    AUTH_SUCCESS: {
        type: MessageType.SUCCESS,
        category: MessageCategory.AUTH,
        code: "AUTH_001",
        template: "Authentication successful",
    },
    AUTH_FAILED: {
        type: MessageType.ERROR,
        category: MessageCategory.AUTH,
        code: "AUTH_002",
        template: "Authentication failed",
    },
    MISSING_ACCESS_TOKEN: {
        type: MessageType.ERROR,
        category: MessageCategory.AUTH,
        code: "AUTH_003",
        template: "Missing access token",
    },
    MISSING_STATE_PARAMETER: {
        type: MessageType.ERROR,
        category: MessageCategory.AUTH,
        code: "AUTH_004",
        template: "Missing state parameter",
    },

    // User messages
    USER_CREATED: {
        type: MessageType.SUCCESS,
        category: MessageCategory.USER,
        code: "USER_001",
        template: "User created successfully",
    },
    USER_UPDATED: {
        type: MessageType.SUCCESS,
        category: MessageCategory.USER,
        code: "USER_002",
        template: "User updated successfully",
    },
    USER_NOT_FOUND: {
        type: MessageType.ERROR,
        category: MessageCategory.USER,
        code: "USER_003",
        template: "User not found",
    },

    // Database messages
    DATABASE_ERROR: {
        type: MessageType.ERROR,
        category: MessageCategory.DATABASE,
        code: "DB_001",
        template: "Database operation failed",
    },
    DB_SAVE_FAILED: {
        type: MessageType.WARNING,
        category: MessageCategory.DATABASE,
        code: "DB_002",
        template: "Database save failed",
    },

    // Validation messages
    INVALID_INPUT: {
        type: MessageType.ERROR,
        category: MessageCategory.VALIDATION,
        code: "VAL_001",
        template: "Invalid input data",
    },

    // System messages
    INTERNAL_ERROR: {
        type: MessageType.ERROR,
        category: MessageCategory.SYSTEM,
        code: "SYS_001",
        template: "Internal server error",
    },
    ROUTE_NOT_FOUND: {
        type: MessageType.ERROR,
        category: MessageCategory.SYSTEM,
        code: "SYS_002",
        template: "Route {{route}} not found",
    },
} as const;

// Message builder utility for dynamic content
export class MessageBuilder {
    static build(messageKey: keyof typeof MESSAGES, variables?: Record<string, string>): string {
        const message = MESSAGES[messageKey];
        if (!message) {
            console.warn(`Message key "${messageKey}" not found`);
            return "Unknown message";
        }

        let result = message.template;

        if (variables) {
            Object.entries(variables).forEach(([key, value]) => {
                result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
            });
        }

        return result;
    }

    static getMessageWithCode(messageKey: keyof typeof MESSAGES, variables?: Record<string, string>): string {
        const message = MESSAGES[messageKey];
        if (!message) {
            return "Unknown message";
        }

        const text = this.build(messageKey, variables);
        return `[${message.code}] ${text}`;
    }

    static getMessage(messageKey: keyof typeof MESSAGES): Message {
        return MESSAGES[messageKey];
    }
}

export const DEFAULT_PAGINATION = {
    PAGE: 1,
    LIMIT: 10,
    MAX_LIMIT: 100,
} as const;

export const CERT_PATHS = {
    KEY: "../../../certs/localhost+2-key.pem",
    CERT: "../../../certs/localhost+2.pem",
} as const;
