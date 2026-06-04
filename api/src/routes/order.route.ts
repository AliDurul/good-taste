import { Router } from "express";

const router: Router = Router();
import { listOrders, getOrder, createOrder, updateOrder, deleteOrder, previewOrder, scanQR, deliverOrder, confirmOrder } from "../controllers/order.controller";
import { validate, parsePagination } from "../middlewares/common";
import { orderCreateSchema, orderPreviewSchema, orderUpdateSchema } from "../schemas";

// orders

router.route('/')
    .get(parsePagination(), listOrders)
    .post(createOrder);

router.post('/scan-qr', scanQR)

router.post('/preview', previewOrder);

router.route('/:id')
    .get(getOrder)
    .put(updateOrder)
    .delete(deleteOrder);

router.patch('/:orderId/confirm', confirmOrder)
router.patch('/:orderId/deliver', deliverOrder)

export default router;
