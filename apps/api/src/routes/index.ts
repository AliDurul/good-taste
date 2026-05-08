import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { Router } from "express";
import userRoutes from "./user.route";
import sessionRoutes from './session.route';
import authRoutes from "./auth.route";
import categoryRoutes from "./category.route";
import productRoutes from "./product.route";



const router: Router = Router();

// auth
router.use('/', authRoutes);

// sessions
router.use('/sessions', requireAuth, sessionRoutes);

// users
router.use('/users', requireAuth, requireRole(['admin']), userRoutes);

// categories
router.use('/categories', requireAuth, categoryRoutes);

// products
router.use('/products', requireAuth, productRoutes);

export default router;