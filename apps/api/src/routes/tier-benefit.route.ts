import { Router } from "express";

const router: Router = Router();
import { listTierBenefits, getTierBenefit, createTierBenefit, updateTierBenefit, deleteTierBenefit } from "../controllers/tier-benefit.controller";
import { requireRole } from "../middlewares/auth.middleware";
import { validate, parsePagination } from "../middlewares/common";

router.route('/')
    .get(parsePagination(), listTierBenefits)
    .post(createTierBenefit);


router.route('/:id')
    .get(getTierBenefit)
    .put(updateTierBenefit)
    .delete(deleteTierBenefit);

export default router;