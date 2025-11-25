// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // If it's your custom ApiError
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            details: err.details || null
        });
    }

    // If it's an unexpected error
    console.error("Unexpected Error:", err);

    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
}
