import type { Request, Response } from "express";
import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { CustomError } from "../lib/common";
import { auth } from "../lib/auth";
import { APIError } from "better-auth/api"; // Import this

const getHeaders = (req: Request) => new Headers(req.headers as Record<string, string>);

// Helper to handle Better Auth errors
const handleAuthError = (error: unknown, next: Function) => {
    if (error instanceof APIError) {
        // Pass to Express error handler
        return next(new CustomError(error.message || 'Authentication error', error.statusCode || 500, true));
    }
    next(error);
};

export const listUsers = async (req: Request, res: Response) => {

    const query = req.query as Record<string, string | undefined>;

    const users = await auth.api.listUsers({
        query: {
            limit: query.limit ? parseInt(query.limit) : 50,
            offset: query.offset ? parseInt(query.offset) : undefined,
            searchValue: query.searchValue,
            searchField: query.searchField as "email" | "name" | undefined,
            searchOperator: query.searchOperator as "contains" | "starts_with" | "ends_with" | undefined,
            filterField: query.filterField,
            filterValue: query.filterValue,
            sortBy: query.sortBy,
            sortDirection: query.sortDirection as "asc" | "desc" | undefined,
        },
        headers: getHeaders(req),
    });
    res.status(200).send({ success: true, data: users });
};

export const createUser: RequestHandler = async (req, res) => {
    const { email, password, name, role, ...data } = req.validatedBody;

    const user = await auth.api.createUser({
        body: {
            email,
            password,
            name,
            role, // optional: "user", "admin", etc.
            data, // optional: additional user fields
        },
    });

    res.status(201).send({ success: true, data: user });
};

export const getUser: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    const user = await auth.api.getUser({
        query: { id },
        headers: getHeaders(req),
    });

    if (!user) {
        throw new CustomError('User not found', 404, true);
    }

    res.status(200).send({ success: true, data: user });
};

export const updateUser: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const updateData = req.validatedBody;
    const updated = await auth.api.adminUpdateUser({
        body: {
            userId: id,
            data: updateData,
        },
        headers: getHeaders(req),
    });

    res.status(200).send({ success: true, data: updated });
};

export const deleteUser: RequestHandler = async (req, res) => {
    const { id } = req.params;

    await auth.api.removeUser({
        body: {
            userId: id,
        },
        headers: getHeaders(req),
    });

    res.status(200).send({ success: true, message: 'User deleted successfully' });
};

export const banUser: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };
    const { banReason, banExpiresIn } = req.validatedBody;

    const user = await prisma.user.findUnique({ where: { id: id! } });
    if (!user) {
        throw new CustomError('User not found', 404, true);
    }

    await auth.api.banUser({
        body: {
            userId: id,
            banReason,
            banExpiresIn, // in seconds, e.g., 60 * 60 * 24 for 1 day
        },
        headers: getHeaders(req),
    });
    res.status(200).send({ success: true, message: 'User banned successfully' });
};

export const unbanUser: RequestHandler = async (req, res) => {
    const { id } = req.params;

    await auth.api.unbanUser({
        body: {
            userId: id,
        },
        headers: getHeaders(req),
    });

    res.status(200).send({ success: true, message: 'User unbanned successfully' });
};

export const setUserRole: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };
    const { role } = req.validatedBody;

    await auth.api.setRole({
        body: {
            userId: id,
            role, // string or string[]
        },
        headers: getHeaders(req),
    });

    res.status(200).send({ success: true, message: 'User role updated successfully' });
};