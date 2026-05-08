import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { CustomError } from "../lib/common";

export const listCategories: RequestHandler = async (req, res) => {
    const query = req.query as Record<string, string | undefined>;

    const categories = await prisma.category.findMany({
        where: {
            isActive: query.isActive ? query.isActive === "true" : undefined,
            name: query.searchValue ? { contains: query.searchValue, mode: "insensitive" } : undefined,
        },
        skip: query.offset ? parseInt(query.offset) : undefined,
        take: query.limit ? parseInt(query.limit) : 20,
        orderBy: query.sortBy ? { [query.sortBy]: query.sortDirection === "desc" ? "desc" : "asc" } : undefined,
    });

    res.status(200).send({ success: true, data: categories });
};

export const getCategory: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
        throw new CustomError('Category not found', 404, true);
    }

    res.status(200).send({ success: true, data: category });
};

export const createCategory: RequestHandler = async (req, res) => {

    const category = await prisma.category.create({
        data: req.validatedBody
    });

    res.status(201).send({ success: true, data: category });
};

export const updateCategory: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    const category = await prisma.category.update({
        where: { id },
        data: req.validatedBody
    });

    res.status(200).send({ success: true, data: category });
};

export const deleteCategory: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    await prisma.category.delete({ where: { id } });

    res.sendStatus(204);
}