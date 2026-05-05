import { Router } from "express";
import { userCreateSchema, userUpdateSchema } from "../lib/schemas";
import { validate } from "../middlewares/common";
import { createUser, deleteUser, getUser, listUsers } from "../controllers/user.controller";

const router: Router = Router();

router.route('/').get(listUsers).post(validate(userCreateSchema), createUser);

router.route('/:id')
    .get(getUser)
    .put(validate(userUpdateSchema), createUser)
    .delete(deleteUser);

export default router;