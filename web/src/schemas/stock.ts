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

export const categoryUpdateSchema = categoryCreateSchema.partial();

export type CategoryUpdate = z.infer<typeof categoryUpdateSchema>;

export const productCreateSchema = z
    .object({
        name: z.string().min(1),
        description: z.string().optional(),
        isActive: z.boolean().default(true),
        image: z.string().url().optional().or(z.literal('')),
        categoryId: z.string().uuid(),
        weightKg: z.number().min(5).positive(),
        price: z.number().positive(),
        stockQty: z.number().int().nonnegative().default(0),
        lowStockThreshold: z.number().int().nonnegative().default(10),
    })
    .strict();

export type ProductCreate = z.infer<typeof productCreateSchema>;

export const productUpdateSchema = productCreateSchema.partial();

export type ProductUpdate = z.infer<typeof productUpdateSchema>;

