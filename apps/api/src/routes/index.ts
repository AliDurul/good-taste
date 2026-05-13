import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { Router } from "express";
import userRoutes from "./user.route";
import sessionRoutes from './session.route';
import authRoutes from "./auth.route";
import categoryRoutes from "./category.route";
import productRoutes from "./product.route";
import variantRoutes from "./variant.route";
import orderRoutes from "./order.route";
import loyaltyTierRoutes from "./loyalty-tier.route";
import walletConfigRoutes from "./wallet-config.route";
import tierBenefitRoutes from "./tier-benefit.route";

const router: Router = Router();


// auth
// router.use('/', authRoutes);
// sessions
// router.use('/sessions', requireAuth, sessionRoutes);


// wallet configs
router.use('/wallet-configs', requireAuth, walletConfigRoutes);

// categories
router.use('/categories', requireAuth, categoryRoutes);

// loyalty tiers
router.use('/loyalty-tiers', requireAuth, loyaltyTierRoutes);

// tier benefits
router.use('/tier-benefits', requireAuth, tierBenefitRoutes);

// products
router.use('/products', requireAuth, productRoutes);

// variants
router.use('/variants', requireAuth, variantRoutes);


// users
router.use('/users', userRoutes);


// orders
// router.use('/orders', requireAuth, orderRoutes);






export default router;