import type { NextFunction, Response, Request } from "express";
import { auth } from "../lib/auth";
import { CustomError } from "../lib/common";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const session = await auth.api.getSession({
        headers: new Headers(req.headers as any),
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
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!roles.includes(req.user.role!)) {
            return res.status(403).json({ error: "Insufficient permissions" });
        }
        next();
    };
}