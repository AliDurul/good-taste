import { Router, RequestHandler } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { CustomError } from "../lib/common";

const router: Router = Router();

// Get current session
export const getCurrentSession: RequestHandler = async (req, res) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    res.json(session);
};

// List all user sessions
export const listSessions: RequestHandler = async (req, res, next) => {
    try {
        const sessions = await auth.api.listSessions({
            headers: fromNodeHeaders(req.headers),
        });
        res.status(200).send({ success: true, data: sessions });
    } catch (error) {
        next(error);
    }

};

// Revoke a specific session
export const revokeSession: RequestHandler = async (req, res) => {
    const { token } = req.validatedBody;

    await auth.api.revokeSession({
        body: { token },
        headers: fromNodeHeaders(req.headers),
    });

    res.status(200).send({ success: true, message: 'Session revoked successfully' });
};

// Revoke all other sessions
export const revokeOtherSessions: RequestHandler = async (req, res) => {
    await auth.api.revokeOtherSessions({
        headers: fromNodeHeaders(req.headers),
    });

    res.status(200).send({ success: true, message: 'All other sessions revoked successfully' });
};


router.get('/', listSessions);
router.get('/me', getCurrentSession);
router.post('/revoke', revokeSession);
router.post('/revoke-others', revokeOtherSessions);

export default router;