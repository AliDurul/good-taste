import { pbkdf2Sync } from "node:crypto";

// CUSTOM ERROR CLASS
export class CustomError extends Error {
    override name = "CustomError";
    statusCode: number;
    isOperational: boolean;
    cause: any;

    constructor(message: string, statusCode: number = 500, isOperational: boolean = false) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
};

export function passwordEncrypt(pass: string): string {

    const keyCode = 'sfsdfsafasdfsadfas';
    const loopCount = 10000;
    const charCount = 32;
    const encType = 'sha512';

    return pbkdf2Sync(pass, keyCode, loopCount, charCount, encType).toString('hex');
}