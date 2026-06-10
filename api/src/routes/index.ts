import { authenticate, } from "../middlewares/auth.middleware";
import { Router } from "express";
import userRoutes from "./user.route";
import sessionRoutes from './session.route';
import authRoutes from "./auth.route";
import categoryRoutes from "./category.route";
import productRoutes from "./product.route";
import orderRoutes from "./order.route";
import loyaltyTierRoutes from "./loyalty-tier.route";
import walletConfigRoutes from "./wallet-config.route";
import walletTransactionRoutes from "./wallet-transaction.route";

const router: Router = Router();

// URL: /api/v1

// auth
// router.use('/', authRoutes);

// sessions
// router.use('/sessions', authenticate, sessionRoutes);

// wallet configs
router.use('/wallet-configs', authenticate, walletConfigRoutes);

// wallet transactions
router.use('/wallet-transactions', authenticate, walletTransactionRoutes);

// categories
router.use('/categories', authenticate, categoryRoutes);

// loyalty tiers
router.use('/loyalty-tiers', authenticate, loyaltyTierRoutes);

// products
router.use('/products', authenticate, productRoutes);

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