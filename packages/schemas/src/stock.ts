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
        // price: z.number().positive(),
        images: z.array(z.string().url()),
        isActive: z.boolean().default(true),
        // pointsValue: z.number().int().positive(),
        // stockQty: z.number().int().nonnegative().default(0),
        // lowStockThreshold: z.number().int().nonnegative().default(10),
        // lastReStockDate: z.date().optional(),
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

export interface IProduct {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    images: string[];
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
    category?: IProductCategory;
    variants?: IProductVariant[];
}

export interface IProductCategory {
    id: string;
    name: string;
    description?: string;
    image?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProductVariant {
    id: string;
    productId: string;
    weightKg: number;
    weightLabel: string;
    price: number;
    earnValue: number;
    images: string[];
    stockQty: number;
    lowStockThreshold: number;
    isOutOfStock: boolean;
    lastRestockedAt: Date | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProductVariantWithProduct extends IProductVariant {
    product: IProduct;
}

export const variantCreateSchema = z
    .object({
        productId: z.string().uuid(),
        weightKg: z.number().positive(),
        weightLabel: z.string().min(1),
        price: z.number().positive(),
        earnValue: z.number().nonnegative(),
        images: z.array(z.string().url()).default([]),
        stockQty: z.number().int().nonnegative().default(0),
        lowStockThreshold: z.number().int().nonnegative().default(0),
        isActive: z.boolean().default(true),
    })
    .strict();

export type VariantCreate = z.infer<typeof variantCreateSchema>;

export const variantUpdateSchema = variantCreateSchema.partial();

export type VariantUpdate = z.infer<typeof variantUpdateSchema>;