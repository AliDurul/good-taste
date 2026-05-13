import { Router } from "express";
import { userBanSchema, userCreateSchema, userSetRoleSchema, userUpdateSchema } from "@workspace/schemas";
import { validate, parsePagination } from "../middlewares/common";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { banUser, createUser, deleteUser, getUser, listUsers, setUserRole, unbanUser, updateUser } from "../controllers/user.controller";

const router: Router = Router();

router.get("/", requireAuth, requireRole(["admin"]), parsePagination(50), listUsers);
router.post("/", requireAuth, requireRole(["admin", "agent"]), createUser);

router.get("/:id", requireAuth, requireRole(["admin"]), getUser);
router.put("/:id", requireAuth, requireRole(["admin"]), validate(userUpdateSchema), updateUser);
router.delete("/:id", requireAuth, requireRole(["admin"]), deleteUser);

router.post("/:id/ban", requireAuth, requireRole(["admin"]), validate(userBanSchema), banUser);
router.post("/:id/unban", requireAuth, requireRole(["admin"]), unbanUser);
router.put("/:id/role", requireAuth, requireRole(["admin"]), validate(userSetRoleSchema), setUserRole);

export default router;
