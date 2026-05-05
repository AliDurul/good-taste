import { NextFunction, Response, Request } from "express";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import id from "zod/v4/locales/id.js";


export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.substring(7)
            : req.cookies?.['better-auth.session_token'];

        if (!token) {
            res.status(401).json({ error: 'Unauthorized - No token provided' });
            return;
        }

        // Verify session using Better Auth
        const session = await auth.api.getSession({
            headers: {
                ...req.headers,
                cookie: `better-auth.session_token=${token}`,
            } as unknown as Headers,
        });

        if (!session || !session.user) {
            res.status(401).json({ error: 'Unauthorized - Invalid token' });
            return;
        }

        // Get user with role from database
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name || undefined,
            // role: dbUser?.role || 'user',
        };
        req.session = session.session;

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Unauthorized - Authentication failed' });
    }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
    requireAuth(req, res, next).catch(() => next());
}