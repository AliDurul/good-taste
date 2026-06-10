import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { CustomError } from "../lib/common";
import { ProductOrderByWithRelationInput, ProductWhereInput } from "../../generated/prisma/models";
import { calculateEarnValue } from "../services/product.services";

export const listProducts: RequestHandler = async (req, res) => {
    const query = req.query as Record<string, string | undefined>;
    const { page, limit, skip } = req.pagination;

    const where: ProductWhereInput = {
        isActive: query.isActive ? query.isActive === "true" : undefined,
        name: query.search ? { contains: query.search, mode: "insensitive" as const } : undefined,
    };

    const orderBy: ProductOrderByWithRelationInput = query.sortBy
        ? { [query.sortBy]: query.sortDirection === "desc" ? "desc" : "asc" }
        : { createdAt: "desc" };

    const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
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

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    if (!product) {
        throw new CustomError('Product not found', 404, true);
    }

    res.status(200).send({ success: true, data: product });
};

export const createProduct: RequestHandler = async (req, res) => {

    const { earnValue, price, ...rest } = req.body as any;

    const product = await prisma.product.create({
        data: {
            ...rest,
            price,
            earnValue: earnValue ?? await calculateEarnValue(price),
        },
        include: {
            category: true,
        }
    });

    res.status(201).send({ success: true, data: product });
};

export const updateProduct: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    const data = { ...req.body };
    // Recompute earnValue when price changes and no explicit earnValue was provided
    if (data.price !== undefined && data.earnValue === undefined) {
        data.earnValue = await calculateEarnValue(data.price);
    }

    const product = await prisma.product.update({
        where: { id },
        data,
    });

    res.status(200).send({ success: true, data: product });
};

export const deleteProduct: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    await prisma.product.delete({ where: { id } });

    res.sendStatus(204);
}