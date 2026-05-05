import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { CustomError } from "../lib/common";


export const listUsers: RequestHandler = async (req, res) => {
    const users = await prisma.user.findMany({
        include: { posts: true },
    });

    res.status(200).send({ success: true, data: users });
};

export const createUser: RequestHandler = async (req, res) => {
    const { email, name } = req.validatedBody;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new CustomError('User already exists', 400, true);
    }

    const user = await prisma.user.create({
        data: { email, name },
    });

    res.status(201).send({ success: true, data: user });
};

export const getUser: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
        where: { id: parseInt(id!, 10) },
        include: { posts: true },
    });

    if (!user) {
        throw new CustomError('User not found', 404, true);
    }

    res.status(200).send({ success: true, data: user });
};

export const updateUser: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { email, name } = req.validatedBody;

    const user = await prisma.user.findUnique({ where: { id: parseInt(id!, 10) } });
    if (!user) {
        throw new CustomError('User not found', 404, true);
    }

    const updated = await prisma.user.update({
        where: { id: parseInt(id!, 10) },
        data: { email, name },
    });

    res.status(200).send({ success: true, data: updated });
};

export const deleteUser: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id: parseInt(id!, 10) } });
    if (!user) {
        throw new CustomError('User not found', 404, true);
    }

    await prisma.user.delete({ where: { id: parseInt(id!, 10) } });

    res.status(200).send({ success: true, message: 'User deleted successfully' });
};