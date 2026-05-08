import z from "zod";

export const userCreateSchema = z
    .object({
        name: z.string().min(2).max(100),
        email: z.string().email(),
        age: z.number().int().positive().max(120),
        password: z.string().min(8),
    })
    .strict();
export type UserCreate = z.infer<typeof userCreateSchema>;

export const userUpdateSchema = z
    .object({
        name: z.string().min(2).max(100).optional(),
        email: z.string().email().optional(),
        age: z.number().int().positive().max(120).optional(),
        password: z.string().min(8).optional(),
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