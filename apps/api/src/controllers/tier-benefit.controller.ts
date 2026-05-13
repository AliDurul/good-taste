import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { CustomError } from "../lib/common";
import { TierBenefitOrderByWithRelationInput, TierBenefitWhereInput } from "../../generated/prisma/models";

export const listTierBenefits: RequestHandler = async (req, res) => {
    const { page, limit, skip } = req.pagination;

    const where: TierBenefitWhereInput = {};

    const [tierBenefits, totalCount] = await Promise.all([
        prisma.tierBenefit.findMany({
            where,
            skip,
            take: limit,
        }),
        prisma.tierBenefit.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).send({
        success: true,
        data: tierBenefits,
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

export const getTierBenefit: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    const tierBenefit = await prisma.tierBenefit.findUnique({ where: { id } });

    if (!tierBenefit) {
        throw new CustomError('TierBenefit not found', 404, true);
    }

    res.status(200).send({ success: true, data: tierBenefit });
};

export const createTierBenefit: RequestHandler = async (req, res) => {


    const tierBenefit = await prisma.tierBenefit.create({
        data: req.body,
    });

    res.status(201).send({ success: true, data: tierBenefit });
};

export const updateTierBenefit: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };


    const tierBenefit = await prisma.tierBenefit.update({
        where: { id },
        data: req.body
    });

    res.status(200).send({ success: true, data: tierBenefit });
};

export const deleteTierBenefit: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    await prisma.tierBenefit.delete({ where: { id } });

    res.sendStatus(204);
}