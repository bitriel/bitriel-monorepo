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

export interface PaginationOptions {
    page: number;
    limit: number;
    sort?: string;
    order?: "asc" | "desc";
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
