import { Router } from "express";
import { userBanSchema, userCreateSchema, userSetRoleSchema, userUpdateSchema } from "@workspace/schemas";
import { validate, parsePagination } from "../middlewares/common";
import { banUser, createUser, deleteUser, getUser, listUsers, setUserRole, updateUser } from "../controllers/user.controller";
import { checkPermission } from "../middlewares/auth.middleware";

const router: Router = Router();

router.route('/')
    .get(parsePagination(50), listUsers)
    .post(checkPermission({ user: ['create'] }), createUser);

export default router;