import { authenticate, } from "../middlewares/auth.middleware";
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
import { upload } from "../middlewares/common";

const router: Router = Router();

// auth
// router.use('/', authRoutes);

// sessions
// router.use('/sessions', authenticate, sessionRoutes);

// wallet configs
router.use('/wallet-configs', authenticate, walletConfigRoutes);

// categories
router.use('/categories', authenticate, categoryRoutes);

// loyalty tiers
router.use('/loyalty-tiers', authenticate, loyaltyTierRoutes);

// products
router.use('/products', authenticate, productRoutes);

// variants
router.use('/variants', authenticate, variantRoutes);

// users
router.use('/users', authenticate, userRoutes); // ?

// orders
router.use('/orders', authenticate, orderRoutes); // ?


// router.post('/upload', upload.single('image'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }
//   res.send({
//     message: 'Image uploaded successfully!',
//     file: req.file // Contains metadata like path, filename, and size
//   });
// });

export default router;