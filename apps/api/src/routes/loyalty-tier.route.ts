import { Router } from "express";

const router: Router = Router();
import { listLoyaltyTiers, getLoyaltyTier, createLoyaltyTier, updateLoyaltyTier, deleteLoyaltyTier } from "../controllers/loyalty-tier.controller";
import { validate, parsePagination } from "../middlewares/common";

router.route('/')
    .get(parsePagination(), listLoyaltyTiers)
    .post(createLoyaltyTier);


router.route('/:id')
    .get(getLoyaltyTier)
    .put(updateLoyaltyTier)
    .delete(deleteLoyaltyTier);

export default router;