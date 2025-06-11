import { Request, Response, NextFunction } from "express";

export interface LogData {
    method: string;
    url: string;
    statusCode?: number;
    responseTime?: number;
    ip: string;
    userAgent?: string;
    timestamp: string;
}

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();

    // Log the incoming request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${req.ip}`);

    // Capture response completion
    res.on("finish", () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        const logData: LogData = {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            responseTime,
            ip: req.ip || "",
            userAgent: req.get("User-Agent") || "",
            timestamp: new Date().toISOString(),
        };

        console.log(
            `[${logData.timestamp}] ${logData.method} ${logData.url} - ${logData.statusCode} - ${logData.responseTime}ms`
        );
    });

    next();
};
