import type { NextFunction, Response, Request } from "express";
import { auth } from "../lib/auth";
import { CustomError } from "../lib/common";
import { fromNodeHeaders } from "better-auth/node";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
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


export const checkPermission = (resources: Record<string, string[]>) => {
    return async (req: any, res: any, next: any) => {

        // Check if user has required permission
        const { success } = await auth.api.userHasPermission({
            headers: fromNodeHeaders(req.headers),
            body: {
                userId: req.user.id,
                permissions: resources,
            },
        });

        if (!success) {
            throw new CustomError("Forbidden - insufficient permissions", 403, true);
        }

        next();
    };
};