import z from "zod";

export const categoryCreateSchema = z
    .object({
        name: z.string().min(1),
        description: z.string().optional(),
        image: z.string().url().optional(),
        isActive: z.boolean().default(true),
    })
    .strict();

export type CategoryCreate = z.infer<typeof categoryCreateSchema>;

export const categoryUpdateSchema = z
    .object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        image: z.string().url().optional(),
        isActive: z.boolean().optional(),
    })
    .strict();

export type CategoryUpdate = z.infer<typeof categoryUpdateSchema>;


export const productCreateSchema = z
    .object({
        name: z.string().min(1),
        description: z.string().optional(),
        image: z.string().url().optional(),
        isActive: z.boolean().default(true),
        categoryId: z.string().uuid(),
        weightKg: z.number().positive(),
        price: z.number().positive(),
        earnValue: z.number().nonnegative().optional(), // computed server-side when omitted
        stockQty: z.number().int().nonnegative().default(0),
        lowStockThreshold: z.number().int().nonnegative().default(10),
        lastRestockedAt: z.coerce.date().optional(),
    })
    .strict();

export type ProductCreate = z.infer<typeof productCreateSchema>;

export const productUpdateSchema = z
    .object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        image: z.string().url().optional(),
        isActive: z.boolean().optional(),
        categoryId: z.string().uuid().optional(),
        weightKg: z.number().positive().optional(),
        price: z.number().positive().optional(),
        earnValue: z.number().nonnegative().optional(),
        stockQty: z.number().int().nonnegative().optional(),
        lowStockThreshold: z.number().int().nonnegative().optional(),
        lastRestockedAt: z.coerce.date().optional(),
    })
    .strict();

export type ProductUpdate = z.infer<typeof productUpdateSchema>;