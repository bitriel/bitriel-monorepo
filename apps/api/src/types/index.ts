import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
        email?: string;
        fullname?: string;
    };
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    warning?: string;
}
