import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { Router } from "express";
import userRoutes from "./user.route";
import sessionRoutes from './session.route';
import authRoutes from "./auth.route";



const router: Router = Router();


// auth
router.use('/', authRoutes);

// sessions
router.use('/sessions', requireAuth, sessionRoutes);


// users
router.use('/users', requireAuth, requireRole(['customer']), userRoutes);

export default router;