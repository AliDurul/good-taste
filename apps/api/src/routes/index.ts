import { Router } from "express";
import userRoutes from "./user.route";

const router: Router = Router();

// home
router.all('/', (req, res) => {
    res.json({ message: "Welcome to the API" });
});

// user
router.use('/users', userRoutes);

export default router;