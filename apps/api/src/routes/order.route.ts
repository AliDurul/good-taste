import { Router } from "express";

const router: Router = Router();
import { listOrders, getOrder, createOrder, updateOrder, deleteOrder, previewOrder } from "../controllers/order.controller";
import { validate, parsePagination } from "../middlewares/common";
import { orderCreateSchema, orderPreviewSchema, orderUpdateSchema } from "@workspace/schemas";

router.route('/')
    .get(parsePagination(), listOrders)
    .post(validate(orderCreateSchema), createOrder);

router.post('/preview', validate(orderPreviewSchema), previewOrder);

router.route('/:id')
    .get(getOrder)
    .put(validate(orderUpdateSchema), updateOrder)
    .delete(deleteOrder);

export default router;
