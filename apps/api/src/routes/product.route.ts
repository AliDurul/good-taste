import { Router } from "express";

const router: Router = Router();
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller";
import { productCreateSchema, productUpdateSchema } from "@workspace/schemas";
import { checkPermission } from "../middlewares/auth.middleware";
import { validate, parsePagination, upload } from "../middlewares/common";

router.route('/')
    .get(parsePagination(), listProducts)
    .post(checkPermission({ product: ['create'] }), upload.single('image'), createProduct);

router.route('/:id')
    .get(getProduct)
    .put(checkPermission({ product: ['update'] }), updateProduct)
    .delete(checkPermission({ product: ['delete'] }), deleteProduct);

export default router;