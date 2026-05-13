import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { CustomError } from "../lib/common";
import { findApplicablePromotion } from "../services/order.services";

export const listOrders: RequestHandler = async (req, res) => {
    const query = req.query as Record<string, string | undefined>;
    const { page, limit, skip } = req.pagination;

    const where: OrderWhereInput = {};

    const [orders, totalCount] = await Promise.all([
        prisma.order.findMany({
            where,
            skip,
            take: limit,
            orderBy: query.sortBy ? { [query.sortBy]: query.sortDirection === "desc" ? "desc" : "asc" } : undefined,
        }),
        prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).send({
        success: true,
        data: orders,
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

export const getOrder: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
        throw new CustomError('Order not found', 404, true);
    }

    res.status(200).send({ success: true, data: order });
};

export const previewOrder: RequestHandler = async (req, res) => {

    const customerId = req.user?.id;

    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new CustomError('Order must contain at least one item', 400, true);
    }

    const variantIds = items.map((item: any) => item.variantId);

    // 1. Fetch all variants fresh — never trust client prices
    const variants = await prisma.productVariant.findMany({
        where: { id: { in: variantIds }, isActive: true },
        include: { product: { select: { id: true, name: true, category: { select: { id: true, name: true } } } } },
    });

    // 2. Validate every item
    const errors: string[] = [];

    for (const item of items) {
        const variant = variants.find(v:any => v.id === item.variantId);

        if (!variant) {
            errors.push(`Variant with ID ${item.variantId} not found or inactive`);
            continue;
        }

        // if (variant.isOutOfStock) {
        //     errors.push(`Variant ${variant.product.name} (${variant.weightLabel}) is out of stock`);
        // }

        // if (item.quantity > variant.stockQty) {
        //     errors.push(`Variant ${variant.product.name} (${variant.weightLabel}) has only ${variant.stockQty} in stock, but ${item.quantity} was requested`);
        // }
    }

    if (errors.length > 0) {
        throw new CustomError(errors.join(", "), 400, true);
    }

    // 3. Build line items
    let totalAmount = 0;
    let walletEarned = 0;
    const lineItems = [];

    console.log(variantIds);
    console.log(variants);

    for (const item of items) {
        const variant = variants.find((v:any) => v.id === item.variantId)!;
        const subtotal = parseFloat((variant.price * item.quantity).toFixed(2));
        const earned = parseFloat((variant.earnValue * item.quantity).toFixed(2));

        totalAmount += subtotal;
        walletEarned += earned;

        lineItems.push({
            variantId: variant?.id,
            productId: variant?.product.id,
            productName: variant?.product.name,
            category: variant?.product.category.name,
            weightLabel: variant?.weightLabel,
            unitPrice: variant?.price,
            earnValue: variant?.earnValue,
            quantity: item.quantity,
            subtotal,
            earnedForLine: earned,
            images: variant?.images,
            inStock: variant.stockQty - item.quantity, // remaining after this order
        });
    }

    totalAmount = parseFloat(totalAmount.toFixed(2));
    walletEarned = parseFloat(walletEarned.toFixed(2));

    // 4. Check for applicable promotion
    const promotion = await findApplicablePromotion(customerId!, variantIds);

    res.status(201).send({ success: true, data: { totalAmount, walletEarned, lineItems } });
};

export const createOrder: RequestHandler = async (req, res) => {

    const customerId = req.user?.id;

    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new CustomError('Order must contain at least one item', 400, true);
    }

    const variantIds = items.map((item: any) => item.variantId);

    const variants = await prisma.productVariant.findMany({
        where: { id: { in: variantIds }, isActive: true },
        include: { product: { select: { id: true, name: true, category: { select: { id: true, name: true } } } } },
    });

    const errors: string[] = [];

    for (const item of items) {
        const variant = variants.find(v => v.id === item.variantId);

        if (!variant) {
            errors.push(`Variant with ID ${item.variantId} not found or inactive`);
            continue;
        }

        // if (variant.isOutOfStock) {
        //     errors.push(`Variant ${variant.product.name} (${variant.weightLabel}) is out of stock`);
        // }

        // if (item.quantity > variant.stockQty) {
        //     errors.push(`Variant ${variant.product.name} (${variant.weightLabel}) has only ${variant.stockQty} in stock, but ${item.quantity} was requested`);
        // }
    }

    if (errors.length > 0) {
        throw new CustomError(errors.join(", "), 400, true);
    }

    let totalAmount = 0;
    let walletEarned = 0;
    const lineItems = [];

    console.log(variantIds);
    console.log(variants);

    for (const item of items) {
        const variant = variants.find((v) => v.id === item.variantId)!;
        const subtotal = parseFloat((variant.price * item.quantity).toFixed(2));
        const earned = parseFloat((variant.earnValue * item.quantity).toFixed(2));

        totalAmount += subtotal;
        walletEarned += earned;

        lineItems.push({
            variantId: variant?.id,
            productId: variant?.product.id,
            productName: variant?.product.name,
            category: variant?.product.category.name,
            weightLabel: variant?.weightLabel,
            unitPrice: variant?.price,
            earnValue: variant?.earnValue,
            quantity: item.quantity,
            subtotal,
            earnedForLine: earned,
            images: variant?.images,
            inStock: variant.stockQty - item.quantity, // remaining after this order
        });
    }

    totalAmount = parseFloat(totalAmount.toFixed(2));
    walletEarned = parseFloat(walletEarned.toFixed(2));

    res.status(201).send({ success: true, });
};

export const updateOrder: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    const order = await prisma.order.update({
        where: { id },
        data: req.body
    });

    res.status(200).send({ success: true, data: order });
};

export const deleteOrder: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    await prisma.order.delete({ where: { id } });

    res.sendStatus(204);
}