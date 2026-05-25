import z from "zod";

export interface IUser {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    role: "customer" | "agent" | "officer" | "admin";
    banned: boolean;
    banReason: string | null;
    banExpires: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    birthday: string | null;
    referralCode: string;
    walletBalance: number;
    totalSpend: number;
    assignedAgentId: string | null;
    tierId: string | null;
    assignedAgent: { id: string, name: string } | null;
    tier: { id: string, name: string } | null;
}

export const userCreateSchema = z
    .object({
        name: z.string().min(2).max(100),
        email: z.string().email(),
        password: z.string().min(8),
        role: z.enum(["customer", "agent", "officer", "admin"]).optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        birthday: z.string().datetime().optional(),
        assignedAgentId: z.string().uuid().optional(),
    })
    .strict();
export type UserCreate = z.infer<typeof userCreateSchema>;

export const userUpdateSchema = z
    .object({
        name: z.string().min(2).max(100).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        birthday: z.string().datetime().optional(),
        assignedAgentId: z.string().uuid().optional(),
    })
    .strict();

export type UserUpdate = z.infer<typeof userUpdateSchema>;


export const userBanSchema = z.object({
    banReason: z.string().min(5).max(255),
    banExpiresIn: z.number().int().positive().optional(), // in days
}).strict();

export type UserBan = z.infer<typeof userBanSchema>;

export const userSetRoleSchema = z.object({
    role: z.string().min(2).max(50),
}).strict();

export type UserSetRole = z.infer<typeof userSetRoleSchema>;