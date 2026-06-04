import type { Request, Response } from "express";
import { RequestHandler } from "express";
import { CustomError } from "../lib/common";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { prisma } from "../lib/prisma";
import { generateReferralCode } from "../lib/utils";
import type { UserWhereInput, UserOrderByWithRelationInput } from "../../generated/prisma/models";


export const listUsers = async (req: Request, res: Response) => {
    const query = req.query as Record<string, string | undefined>;
    const { page, limit, skip } = req.pagination;

    const where: UserWhereInput = {
        name: query.search ? { contains: query.search, mode: "insensitive" as const } : undefined,
        ...(query.roles && { role: { in: query.roles.split(",").filter(Boolean) } }),
    };

    const orderBy: UserOrderByWithRelationInput = query.sortBy
        ? { [query.sortBy]: query.sortDirection === "asc" ? "asc" : "desc" }
        : { createdAt: "desc" };

    const [users, totalCount] = await Promise.all([
        prisma.user.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            include: {
                assignedAgent: { select: { id: true, name: true } },
                tier: { select: { id: true, name: true } },
            }
        }),
        prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).send({
        success: true,
        data: users,
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
    const { email, password, name, role, image, phone, address, city, country, birthday, assignedAgentId } = req.body;

    const isAdminCreating = req.user?.role === "admin";
    const effectiveRole = isAdminCreating ? (role ?? "customer") : "customer";

    // If the creator is an agent, bind this customer to them regardless of body
    const effectiveAgentId: string | undefined = req.user?.role === "agent" ? req.user.id : assignedAgentId;


    interface CreateUserResult {
        user?: { id: string };
        id?: string;
    }

    let result = await auth.api.createUser({
        body: {
            email,
            password,
            // Omit password entirely - user can't login until they set it
            name,
            role: effectiveRole,
            data: {
                image,
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

    // // 3. Send invite email - use Magic Link plugin or Password Reset
    // // Option A: Magic Link (they click, auto-login, then prompt to set password)
    // await authClient.signIn.magicLink({
    //     email,
    //     callbackURL: "/auth/setup-password?firstLogin=true"
    // });
    // // Option B: Force Password Reset (cleaner for "Set your password" UX)
    // // Generate reset token and send custom email
    // const resetData = await auth.api.forgetPassword({
    //     body: { email, redirectTo: "/auth/set-password" }
    // });
    // // Send custom email with deep link: 
    // // myapp://set-password?token=xxx

    res.status(201).send({ success: true, data: result });
};

export const getUser: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        throw new CustomError("User not found", 404, true);
    }

    res.status(200).send({ success: true, data: user });
};

export const updateUser: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const { birthday, ...rest } = req.body;

    const data = await auth.api.adminUpdateUser({
        body: {
            userId: id,
            data: {
                ...rest,
                ...(birthday && { birthday: new Date(birthday) }),
            },
        },
        headers: fromNodeHeaders(req.headers),
    });

    res.status(200).send({ success: true, data });
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
    const { banReason, banExpiresIn } = req.body;

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
    const { role } = req.body;

    await auth.api.setRole({
        body: {
            userId: id,
            role, // string or string[]
        },
        headers: fromNodeHeaders(req.headers),
    });

    res.status(200).send({ success: true, message: 'User role updated successfully' });
};