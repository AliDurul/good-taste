import { Router } from "express";
import { userUpdateSchema } from "@workspace/schemas";
import { validate, parsePagination } from "../middlewares/common";
import { createUser, deleteUser, getUser, listUsers, updateUser } from "../controllers/user.controller";
import { checkPermission } from "../middlewares/auth.middleware";

const router: Router = Router();

router.route('/')
    .get(parsePagination(50), listUsers)
    .post(checkPermission({ user: ['create'] }), createUser);

router.route('/:id')
    .get(getUser)
    .put(checkPermission({ user: ['update'] }), validate(userUpdateSchema), updateUser)
    .delete(checkPermission({ user: ['delete'] }), deleteUser);

export default router;