import { Router } from "express";
import { getDashboardStats, getSalesReport, getOrdersReport } from "../controllers/analytics.controller";

const router: Router = Router();

// analytics

router.get('/dashboard', getDashboardStats);
router.get('/sales', getSalesReport);
router.get('/orders', getOrdersReport);

export default router;
