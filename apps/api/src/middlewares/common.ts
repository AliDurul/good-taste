import { NextFunction, RequestHandler, Response, Request } from "express";
import { CustomError } from "../lib/common";
import { z } from 'zod';
import { APIError } from "better-auth/api";

// 404 NOT FOUND MIDDLEWARE
export const notFound: RequestHandler = (req, res, next) => {
    const error = new CustomError(`Not Found - ${req.originalUrl}`, 404, true);
    next(error);
};

// ERROR HANDLER MIDDLEWARE
export async function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): Promise<void> {
    let statusCode = 500;
    let message = "Something went wrong";
    let isOperational = false;
    let stack: string | undefined;
    let cause: unknown = null;

    if (err instanceof CustomError) {
        statusCode = err.statusCode;
        message = err.message;
        isOperational = err.isOperational;
        stack = err.stack;
        cause = err.cause ?? null;
    } else if (err instanceof APIError) {
        statusCode = err.statusCode;
        message = err.message || "Authentication error";
        isOperational = true;
        stack = err.stack;
    } else if (err instanceof Error) {
        message = err.message;
        stack = err.stack;
    }

    if (!isOperational) {
        console.error("Unhandled error:", err);
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "production" ? null : stack,
        cause,
    });
}

// PAGINATION MIDDLEWARE
export const parsePagination = (defaultLimit = 20): RequestHandler => (req, _res, next) => {
    const query = req.query as Record<string, string | undefined>;
    const page = Math.max(1, query.page ? parseInt(query.page) : 1);
    const limit = Math.max(1, query.limit ? parseInt(query.limit) : defaultLimit);
    req.pagination = { page, limit, skip: (page - 1) * limit };
    next();
};

// ZOD VALIDATION MIDDLEWARE
export const validate = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        // Parse and validate the request body
        const validatedData = schema.parse(req.body);
        // Optionally attach validated data to req object
        req.validatedBody = validatedData;
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Return structured error response
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message,
                })),
            });
        }
        next(error);
    }
};
