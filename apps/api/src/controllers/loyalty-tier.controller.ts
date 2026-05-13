import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { CustomError } from "../lib/common";
import { LoyaltyTierOrderByWithRelationInput, LoyaltyTierWhereInput } from "../../generated/prisma/models";

export const listLoyaltyTiers: RequestHandler = async (req, res) => {
    const query = req.query as Record<string, string | undefined>;
    const { page, limit, skip } = req.pagination;

    const where: LoyaltyTierWhereInput = {};
    const orderBy: LoyaltyTierOrderByWithRelationInput = query.sortBy ? { [query.sortBy]: query.sortDirection === "desc" ? "desc" : "asc" } : { createdAt: "desc" };

    const [loyaltyTiers, totalCount] = await Promise.all([
        prisma.loyaltyTier.findMany({
            where,
            skip,
            take: limit,
            orderBy,
        }),
        prisma.loyaltyTier.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).send({
        success: true,
        data: loyaltyTiers,
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

export const getLoyaltyTier: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    const loyaltyTier = await prisma.loyaltyTier.findUnique({ where: { id } });

    if (!loyaltyTier) {
        throw new CustomError('LoyaltyTier not found', 404, true);
    }

    res.status(200).send({ success: true, data: loyaltyTier });
};

export const createLoyaltyTier: RequestHandler = async (req, res) => {


    const loyaltyTier = await prisma.loyaltyTier.create({
        data: req.body,
    });

    res.status(201).send({ success: true, data: loyaltyTier });
};

export const updateLoyaltyTier: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };


    const loyaltyTier = await prisma.loyaltyTier.update({
        where: { id },
        data: req.body
    });

    res.status(200).send({ success: true, data: loyaltyTier });
};

export const deleteLoyaltyTier: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    await prisma.loyaltyTier.delete({ where: { id } });

    res.sendStatus(204);
}