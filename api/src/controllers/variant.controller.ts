import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { CustomError } from "../lib/common";
import { ProductVariantInclude, ProductVariantWhereInput } from "../../generated/prisma/models";

export const listVariants: RequestHandler = async (req, res) => {
    const query = req.query as Record<string, string | undefined>;
    const { page, limit, skip } = req.pagination;

    const where: ProductVariantWhereInput = {
        isActive: query.isActive ? query.isActive === "true" : undefined,
        isOutOfStock: query.isOutOfStock ? query.isOutOfStock === "true" : undefined,
    };

    if (query?.ids) {
        where['id'] = { in: (query.ids as string).split(',') };
        where['isActive'] = true;
        where['isOutOfStock'] = false;
    }

    const include: ProductVariantInclude = {};
    
    if (query?.includeProduct === 'true') {
        include.product = {
            select: {name: true }
        }
    }

    const [variants, totalCount] = await Promise.all([
        prisma.productVariant.findMany({
            where,
            skip,
            take: limit,
            orderBy: query.sortBy ? { [query.sortBy]: query.sortDirection === "desc" ? "desc" : "asc" } : undefined,
            include
        }),
        prisma.productVariant.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).send({
        success: true,
        data: variants,
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

export const getVariant: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    const productVariant = await prisma.productVariant.findUnique({ where: { id } });

    if (!productVariant) {
        throw new CustomError('Variant not found', 404, true);
    }

    res.status(200).send({ success: true, data: productVariant });
};

export const createVariant: RequestHandler = async (req, res) => {

    const productVariant = await prisma.productVariant.create({
        data: req.body
    });

    res.status(201).send({ success: true, data: productVariant });
};

export const updateVariant: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    const productVariant = await prisma.productVariant.update({
        where: { id },
        data: req.body
    });

    res.status(200).send({ success: true, data: productVariant });
};

export const deleteVariant: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    await prisma.productVariant.delete({ where: { id } });

    res.sendStatus(204);
}