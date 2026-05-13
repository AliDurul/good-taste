import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { CustomError } from "../lib/common";
import { WalletConfigOrderByWithRelationInput, WalletConfigWhereInput } from "../../generated/prisma/models";

export const listWalletConfigs: RequestHandler = async (req, res) => {
    const query = req.query as Record<string, string | undefined>;
    const { page, limit, skip } = req.pagination;

    const where: WalletConfigWhereInput = {};
    const orderBy: WalletConfigOrderByWithRelationInput = query.sortBy ? { [query.sortBy]: query.sortDirection === "desc" ? "desc" : "asc" } : { updatedAt: "desc" };

    const [walletConfigs, totalCount] = await Promise.all([
        prisma.walletConfig.findMany({
            where,
            skip,
            take: limit,
            orderBy,
        }),
        prisma.walletConfig.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).send({
        success: true,
        data: walletConfigs,
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

export const getWalletConfig: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    const walletConfig = await prisma.walletConfig.findUnique({ where: { id } });

    if (!walletConfig) {
        throw new CustomError('WalletConfig not found', 404, true);
    }

    res.status(200).send({ success: true, data: walletConfig });
};

export const createWalletConfig: RequestHandler = async (req, res) => {


    const walletConfig = await prisma.walletConfig.create({
        data: req.body,
    });

    res.status(201).send({ success: true, data: walletConfig });
};

export const updateWalletConfig: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };


    const walletConfig = await prisma.walletConfig.update({
        where: { id },
        data: req.body
    });

    res.status(200).send({ success: true, data: walletConfig });
};

export const deleteWalletConfig: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    await prisma.walletConfig.delete({ where: { id } });

    res.sendStatus(204);
}