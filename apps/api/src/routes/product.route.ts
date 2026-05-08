import { Router } from "express";

const router: Router = Router();
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller";
import { productCreateSchema, productUpdateSchema } from "@workspace/schemas";
import { requireRole } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/common";

router.route('/')
    .get(listProducts)
    .post(requireRole(['admin']), validate(productCreateSchema),createProduct);

router.route('/:id')
    .get(getProduct)
    .put(requireRole(['admin']),validate(productUpdateSchema), updateProduct)
    .delete(requireRole(['admin']), deleteProduct);

export default router;