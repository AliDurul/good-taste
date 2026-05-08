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
        price: z.number().positive(),
        images: z.array(z.string().url()).optional(),
        isActive: z.boolean().default(true),
        pointsValue: z.number().int().positive(),
        stockQty: z.number().int().nonnegative().default(0),
        lowStockThreshold: z.number().int().nonnegative().default(10),
        lastReStockDate: z.date().optional(),
        categoryId: z.string().uuid(),
    })
    .strict();

export type ProductCreate = z.infer<typeof productCreateSchema>;

export const productUpdateSchema = z
    .object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        images: z.array(z.string().url()).optional(),
        isActive: z.boolean().optional(),
        pointsValue: z.number().int().positive().optional(),
        stockQty: z.number().int().nonnegative().optional(),
        lowStockThreshold: z.number().int().nonnegative().optional(),
        lastReStockDate: z.date().optional(),
        categoryId: z.string().uuid().optional(),
    })
    .strict();

export type ProductUpdate = z.infer<typeof productUpdateSchema>;