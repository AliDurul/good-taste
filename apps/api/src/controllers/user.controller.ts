import type { Request, Response } from "express";
import { RequestHandler } from "express";
import { CustomError } from "../lib/common";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { prisma } from "../lib/prisma";
import { generateReferralCode } from "../lib/utils";


export const listUsers = async (req: Request, res: Response) => {
    const query = req.query as Record<string, string | undefined>;
    const { page, limit, skip } = req.pagination;

    const result = await auth.api.listUsers({
        query: {
            limit,
            offset: skip,
            searchValue: query.searchValue,
            searchField: query.searchField as "email" | "name" | undefined,
            searchOperator: query.searchOperator as "contains" | "starts_with" | "ends_with" | undefined,
            filterField: query.filterField,
            filterValue: query.filterValue,
            sortBy: query.sortBy,
            sortDirection: query.sortDirection as "asc" | "desc" | undefined,
        },
        headers: fromNodeHeaders(req.headers),
    });

    const totalCount = result.total;
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).send({
        success: true,
        data: result.users,
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

export const createUser: RequestHandler = async (req, res) => {
    const { email, password, name, role, phone, address, city, country, birthday, assignedAgentId } = req.body;

    const isAdminCreating = req.user?.role === "admin";
    const effectiveRole = isAdminCreating ? (role ?? "customer") : "customer";

    // If the creator is an agent, bind this customer to them regardless of body
    const effectiveAgentId: string | undefined =
        req.user?.role === "agent" ? req.user.id : assignedAgentId;


    interface CreateUserResult {
        user?: { id: string };
        id?: string;
    }

    let result = await auth.api.createUser({
        body: {
            email,
            password,
            name,
            role: effectiveRole,
            data: {
                phone,
                address,
                city,
                country,
                birthday: birthday ? new Date(birthday) : undefined,
                assignedAgentId: effectiveAgentId
            },
        },
        headers: fromNodeHeaders(req.headers),
    }) as CreateUserResult;


    const userId: string | undefined = result?.user?.id ?? result?.id;

    if (userId && effectiveRole === "customer") {
        await prisma.$transaction(async (tx) => {
            const bronzeTier = await tx.loyaltyTier.findFirst({ where: { name: "Bronze" } });

            if (!bronzeTier) {
                throw new CustomError("Bronze loyalty tier is not seeded. Run the database seed before creating customers.", 500, false);
            }

            const referralCode = generateReferralCode();

            result = await tx.user.update({
                where: { id: userId },
                data: { referralCode, tierId: bronzeTier.id },
            });

            await tx.tierHistory.create({
                data: { customerId: userId, fromTierId: null, toTierId: bronzeTier.id, reason: "initial" },
            });
        });
    }

    res.status(201).send({ success: true, data: result });
};

export const getUser: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    const user = await auth.api.getUser({
        query: { id },
        headers: fromNodeHeaders(req.headers),
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
        headers: fromNodeHeaders(req.headers),
    });

    res.status(200).send({ success: true, data: updated });
};

export const deleteUser: RequestHandler = async (req, res) => {
    const { id } = req.params;

    await auth.api.removeUser({
        body: {
            userId: id,
        },
        headers: fromNodeHeaders(req.headers),
    });

    res.status(200).send({ success: true, message: 'User deleted successfully' });
};

export const banUser: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };
    const { banReason, banExpiresIn } = req.validatedBody;

    await auth.api.banUser({
        body: {
            userId: id,
            banReason,
            banExpiresIn, // in seconds, e.g., 60 * 60 * 24 for 1 day
        },
        headers: fromNodeHeaders(req.headers),
    });
    res.status(200).send({ success: true, message: 'User banned successfully' });
};

export const unbanUser: RequestHandler = async (req, res) => {
    const { id } = req.params;

    await auth.api.unbanUser({
        body: {
            userId: id,
        },
        headers: fromNodeHeaders(req.headers),
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
        headers: fromNodeHeaders(req.headers),
    });

    res.status(200).send({ success: true, message: 'User role updated successfully' });
};