import { Router } from "express";

const router: Router = Router();
import { listVariants, getVariant, createVariant, updateVariant, deleteVariant } from "../controllers/variant.controller";
import { productCreateSchema, productUpdateSchema } from "@workspace/schemas";
import { validate, parsePagination } from "../middlewares/common";

router.route('/')
    .get(parsePagination(), listVariants)
    .post(createVariant);

router.route('/:id')
    .get(getVariant)
    .put(updateVariant)
    .delete(deleteVariant);

export default router;