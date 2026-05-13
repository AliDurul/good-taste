import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { CustomError } from "../lib/common";
import { ProductOrderByWithRelationInput, ProductWhereInput } from "../../generated/prisma/models";

export const listProducts: RequestHandler = async (req, res) => {
    const query = req.query as Record<string, string | undefined>;
    const { page, limit, skip } = req.pagination;


    const where: ProductWhereInput = {
        isActive: query.isActive ? query.isActive === "true" : undefined,
        name: query.searchValue ? { contains: query.searchValue, mode: "insensitive" as const } : undefined,
    };

    const orderBy: ProductOrderByWithRelationInput = query.sortBy ? { [query.sortBy]: query.sortDirection === "desc" ? "desc" : "asc" } : { createdAt: "desc" };

    const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                variants: true,
                category: true,
            }
        }),
        prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).send({
        success: true,
        data: products,
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

export const getProduct: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
        throw new CustomError('Product not found', 404, true);
    }

    res.status(200).send({ success: true, data: product });
};

export const createProduct: RequestHandler = async (req, res) => {

    const { variants, ...productData } = req.body as any;

    const product = await prisma.product.create({
        data: {
            ...productData,
            variants: {
                create: variants.map((variant: any) => ({
                    weightKg: variant.weightKg,
                    weightLabel: variant.weightLabel,
                    price: variant.price,
                    earnValue: variant.earnValue,
                    images: variant.images,
                    stockQty: variant.stockQty,
                    lowStockThreshold: variant.lowStockThreshold,
                }))
            },
        },

        include: {
            variants: true,
            category: true,
        }
    });

    res.status(201).send({ success: true, data: product });
};

export const updateProduct: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };


    const product = await prisma.product.update({
        where: { id },
        data: req.validatedBody
    });

    res.status(200).send({ success: true, data: product });
};

export const deleteProduct: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    await prisma.product.delete({ where: { id } });

    res.sendStatus(204);
}