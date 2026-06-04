import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { CustomError } from "../lib/common";
import { WalletTransactionOrderByWithRelationInput, WalletTransactionWhereInput } from "../../generated/prisma/models";

export const listWalletTransactions: RequestHandler = async (req, res) => {
    const query = req.query as Record<string, string | undefined>;
    const { page, limit, skip } = req.pagination;

    const where: WalletTransactionWhereInput = {};
    const orderBy: WalletTransactionOrderByWithRelationInput = query.sortBy
        ? { [query.sortBy]: query.sortDirection === "desc" ? "desc" : "asc" }
        : { createdAt: "desc" };

    const [walletTransactions, totalCount] = await Promise.all([
        prisma.walletTransaction.findMany({
            where,
            skip,
            take: limit,
            orderBy,
        }),
        prisma.walletTransaction.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).send({
        success: true,
        data: walletTransactions,
        pagination: {
            page,
            limit,
            totalCount,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    });
};

export const getWalletTransaction: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    const walletTransaction = await prisma.walletTransaction.findUnique({ where: { id } });

    if (!walletTransaction) {
        throw new CustomError('WalletTransaction not found', 404, true);
    }

    res.status(200).send({ success: true, data: walletTransaction });
};
