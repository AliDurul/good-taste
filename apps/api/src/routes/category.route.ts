import { Router } from "express";

const router: Router = Router();
import { listCategories, getCategory, createCategory, updateCategory, deleteCategory } from "../controllers/category.controller";
import { categoryCreateSchema, categoryUpdateSchema } from "@workspace/schemas";
import { requireRole } from "../middlewares/auth.middleware";
import { validate, parsePagination } from "../middlewares/common";

router.route('/')
    .get(parsePagination(), listCategories)
    .post(requireRole(['admin']), createCategory);

router.route('/:id')
    .get(getCategory)
    .put(requireRole(['admin']), updateCategory)
    .delete(requireRole(['admin']), deleteCategory);

export default router;