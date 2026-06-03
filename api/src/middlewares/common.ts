import { NextFunction, RequestHandler, Response, Request } from "express";
import { CustomError } from "../lib/common";
import { z } from 'zod';
import { APIError } from "better-auth/api";
import multer from "multer";
import fs from "fs";
import { PrismaClientValidationError } from "../../generated/prisma/internal/prismaNamespace";

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
    } else if (err instanceof PrismaClientValidationError) {
        statusCode = 400;
        message = "Prisma validation error: Invalid input data";
        isOperational = true;
        stack = err.stack;
    } else if (err instanceof Error) {
        message = err.message;
        stack = err.stack;
    }

    // Remove uploaded file if present (in case of error after upload)
    if (req.file && req.file.path) {
        fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) {
                console.error("Failed to remove uploaded file after error:", unlinkErr);
            }
        });
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
        // Remove uploaded file if validation fails
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) {
                    console.error("Failed to remove uploaded file after validation error:", unlinkErr);
                }
            });
        }
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

// MULTER
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E4);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
})

export const upload = multer({ storage });