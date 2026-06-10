export interface IProduct {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    image?: string;
    categoryId: string;
    weightKg: number;
    price: number;
    earnValue: number;
    stockQty: number;
    lowStockThreshold: number;
    lastRestockedAt: Date | null;
    category?: IProductCategory;
    createdAt: Date;
    updatedAt: Date;
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