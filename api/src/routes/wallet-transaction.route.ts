import { Router } from "express";

const router: Router = Router();
import { listWalletTransactions, getWalletTransaction} from "../controllers/wallet-transaction.controller";
import { validate, parsePagination } from "../middlewares/common";

// /wallet-transactions

router.get('/', parsePagination(), listWalletTransactions)

router.get('/:id', getWalletTransaction)

export default router;