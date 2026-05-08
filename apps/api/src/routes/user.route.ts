import { Router } from "express";
import { userBanSchema, userCreateSchema, userSetRoleSchema, userUpdateSchema } from "@workspace/schemas";
import { validate } from "../middlewares/common";
import { banUser, createUser, deleteUser, getUser, listUsers, setUserRole } from "../controllers/user.controller";

const router: Router = Router();

router.route('/')
    .get(listUsers)
    .post(validate(userCreateSchema), createUser);

router.route('/:id')
    .get(getUser)
    .put(validate(userUpdateSchema), createUser)
    .delete(deleteUser);

router.post('/:id/ban', validate(userBanSchema), banUser);
router.post('/:id/unban', banUser);
router.put('/:id/role', validate(userSetRoleSchema), setUserRole);


export default router;