import { Router } from "express";

const router: Router = Router();
import { listWalletConfigs, getWalletConfig, createWalletConfig, updateWalletConfig, deleteWalletConfig } from "../controllers/wallet-config.controller";
import { validate, parsePagination } from "../middlewares/common";

router.route('/')
    .get(parsePagination(), listWalletConfigs)
    .post(createWalletConfig);


router.route('/:id')
    .get(getWalletConfig)
    .put(updateWalletConfig)
    .delete(deleteWalletConfig);

export default router;