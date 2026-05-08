import { Router } from "express";
import { userCreateSchema, userUpdateSchema } from "@workspace/schemas";
import { validate } from "../middlewares/common";
import { createUser, deleteUser, getUser, listUsers } from "../controllers/user.controller";

const router: Router = Router();

router.route('/').get(listUsers).post(validate(userCreateSchema), createUser);

router.route('/:id')
    .get(getUser)
    .put(validate(userUpdateSchema), createUser)
    .delete(deleteUser);

// Customer routes
// app.post("/api/orders",
// 	authMiddleware,
// 	requireRole(["customer", "agent", "admin", "stock_manager"]),
// 	async (req, res) => {
// 		// Customers can create orders
// 	}
// )



export default router;