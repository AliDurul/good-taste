import { Router } from "express";

const router: Router = Router();
import { listOrders, getOrder, createOrder, updateOrder, deleteOrder, previewOrder } from "../controllers/order.controller";
import { requireRole } from "../middlewares/auth.middleware";
import { validate, parsePagination } from "../middlewares/common";

router.route('/')
    .get(parsePagination(), listOrders)
    .post(createOrder);

router.post('/preview', previewOrder);

router.route('/:id')
    .get(getOrder)
    .put(updateOrder)
    .delete(deleteOrder);

export default router;