import { Router } from "express";

const router: Router = Router();
import { listCategories, getCategory, createCategory, updateCategory, deleteCategory } from "../controllers/category.controller";
import { categoryCreateSchema, categoryUpdateSchema } from "@workspace/schemas";
import { checkPermission } from "../middlewares/auth.middleware";
import { validate, parsePagination } from "../middlewares/common";

router.route('/')
    .get(parsePagination(), listCategories)
    .post(checkPermission({ category: ['create'] }), createCategory);

router.route('/:id')
    .get(getCategory)
    .put(checkPermission({ category: ['update'] }), updateCategory)
    .delete(checkPermission({ category: ['delete'] }), deleteCategory);

export default router;