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
        image: z.string().url().optional(),
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
        image: z.string().url().optional(),
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
    image?: string;
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
    image?: string;
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
        image: z.string().url().optional(),
        stockQty: z.number().int().nonnegative().default(0),
        lowStockThreshold: z.number().int().nonnegative().default(0),
        isActive: z.boolean().default(true),
    })
    .strict();

export type VariantCreate = z.infer<typeof variantCreateSchema>;

export const variantUpdateSchema = variantCreateSchema.partial();

export type VariantUpdate = z.infer<typeof variantUpdateSchema>;

// ─── Form-specific schemas (product + variants creation) ─────────────────────

export const variantFormItemSchema = z.object({
    id: z.string().uuid().optional(),
    weightLabel: z.string().min(1, 'Weight label is required'),
    weightKg: z.number({ invalid_type_error: 'Enter a valid weight' }).positive('Weight must be greater than 0'),
    price: z.number({ invalid_type_error: 'Enter a valid price' }).positive('Price must be greater than 0'),
    earnValue: z.number({ invalid_type_error: 'Enter a valid earn value' }).nonnegative(),
    stockQty: z.number().int().nonnegative().default(0),
    lowStockThreshold: z.number().int().nonnegative().default(0),
    isActive: z.boolean().default(true),
});

export type VariantFormItem = z.infer<typeof variantFormItemSchema>;

export const productWithVariantsCreateSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().optional(),
    categoryId: z.string().uuid('Please select a category'),
    isActive: z.boolean().default(true),
    image: z.string().optional(),
    variants: z.array(variantFormItemSchema).default([]),
});

export type ProductWithVariantsCreate = z.infer<typeof productWithVariantsCreateSchema>;