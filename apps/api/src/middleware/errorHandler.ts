import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS, MessageBuilder } from "../constants";
import { ApiResponse } from "../types";

export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (error: Error | AppError, req: Request, res: Response, next: NextFunction): void => {
    let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message: string = MessageBuilder.build("INTERNAL_ERROR");

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    } else if (error.name === "ValidationError") {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = MessageBuilder.build("INVALID_INPUT");
    } else if (error.name === "MongoError" || error.name === "MongooseError") {
        statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        message = MessageBuilder.build("DATABASE_ERROR");
    }

    console.error("Error:", {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
    });

    const response: ApiResponse = {
        success: false,
        error: message,
    };

    res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response): void => {
    const response: ApiResponse = {
        success: false,
        error: MessageBuilder.build("ROUTE_NOT_FOUND", { route: req.originalUrl }),
    };

    res.status(HTTP_STATUS.NOT_FOUND).json(response);
};
