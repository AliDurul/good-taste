import type { NextFunction, Response, Request } from "express";
import { auth } from "../lib/auth";
import { CustomError } from "../lib/common";
import { fromNodeHeaders } from "better-auth/node";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
        throw new CustomError("No active session", 401, true);
    }
    if (session.user.banned) {
        throw new CustomError("Account banned", 403, true);
    }
    req.user = session.user;
    next();
}

// Role checker middleware factory
export function requireRole(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new CustomError("Unauthorized", 401, true);
        }
        if (!roles.includes(req.user.role!)) {
            throw new CustomError("Insufficient permissions", 403, true);
        }
        next();
    };
}