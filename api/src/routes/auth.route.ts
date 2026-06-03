import { Router } from "express";

import { signIn, signOut, signUp} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/common";
import { signInSchema, signUpSchema } from "../schemas";

const router: Router = Router();

router.post('/sign-in', validate(signInSchema), signIn);
router.post('/sign-up', validate(signUpSchema), signUp);
router.post('/sign-out', authenticate, signOut);

export default router;