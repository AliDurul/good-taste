import { Router } from "express";
import { getCurrentSession, listSessions, revokeOtherSessions, revokeSession } from "../controllers/session.controller";

const router: Router = Router();

router.get('/', listSessions);
router.get('/me', getCurrentSession);
router.post('/revoke', revokeSession);
router.post('/revoke-others', revokeOtherSessions);

export default router;