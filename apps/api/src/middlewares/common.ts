import { NextFunction, RequestHandler, Response, Request } from "express";
import { CustomError } from "../lib/common";
import { z } from 'zod';

// 404 NOT FOUND MIDDLEWARE
export const notFound: RequestHandler = (req, res, next) => {
    const error = new CustomError(`Not Found - ${req.originalUrl}`, 404, true);
    next(error);
};

// ERROR HANDLER MIDDLEWARE
export async function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction): Promise<void> {
    let error: any = { ...err };
    error.message = err.message || "Something went wrong";
    error.statusCode = err.statusCode || 500;
    error.cause = err.cause || null;
    error.isOperational = err.isOperational || false;
    error.stack = err.stack || null;

    // isTrusted error
    if (!(err instanceof CustomError && error.isOperational)) {
        console.log('untrusted error: ', error);
        // await sendMail({ to: 'alidrl26@gmail.com', subject: 'Error Occurred', tempFn: errorEmailTemp, data: error });
        // process.exit(1);
    }

    // console.log('Error Handler: ', error);

    res.status(error.statusCode).send({
        success: false,
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? null : error.stack,
        cause: error.cause || null,
    });
}

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
