import { Router } from "express";
import userRoutes from "./user.route";
import sessionRoutes from './auth.session.route';
import { authMiddleware } from "../middlewares/auth.middleware";

const router: Router = Router();

// home
router.all('/', authMiddleware, (req, res) => {
    res.json({ message: "Welcome to the API" });
});

// session
router.use('/auth/sessions',authMiddleware, sessionRoutes);

// user
router.use('/users', userRoutes);

export default router;