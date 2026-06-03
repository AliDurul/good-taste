import { randomUUID } from "crypto";
import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { CustomError } from "../lib/common";
import { checkAndUpdateTier, findApplicablePromotion, getWalletExpiry } from "../services/order.services";

// ---------------------------------------------------------------------------
// Helper: fetch + validate variants, enforce stock
// ---------------------------------------------------------------------------
async function buildLineItems(items: { variantId: string; quantity: number }[]) {
    const variantIds = items.map((i) => i.variantId);

    const variants = await prisma.productVariant.findMany({
        where: { id: { in: variantIds }, isActive: true },
        include: { product: { select: { id: true, name: true, category: { select: { id: true, name: true } } } } },
    });

    const errors: string[] = [];
    for (const item of items) {
        const variant = variants.find((v) => v.id === item.variantId);
        if (!variant) { errors.push(`Variant ${item.variantId} not found or inactive`); continue; }
        if (variant.isOutOfStock) {
            errors.push(`${variant.product.name} (${variant.weightLabel}) is out of stock`);
        } else if (item.quantity > variant.stockQty) {
            errors.push(`${variant.product.name} (${variant.weightLabel}) only has ${variant.stockQty} in stock`);
        }
    }
    if (errors.length > 0) throw new CustomError(errors.join("; "), 400, true);

    return { variants, variantIds };
}

// ---------------------------------------------------------------------------
// Helper: apply a promotion to totals
// ---------------------------------------------------------------------------
function applyPromotion(
    promotion: Awaited<ReturnType<typeof findApplicablePromotion>>,
    totalAmount: number
) {
    let discountAmount = 0;
    let isFreeDelivery = false;
    let earnMultiplier = 1;

    if (!promotion) return { discountAmount, isFreeDelivery, earnMultiplier };

    const val = promotion.discountValue ?? 0;
    switch (promotion.type) {
        case "percentage_discount":
        case "bundle":
            discountAmount = parseFloat(((totalAmount * val) / 100).toFixed(2)); break;
        case "fixed_discount":
            discountAmount = Math.min(val, totalAmount); break;
        case "free_delivery":
            isFreeDelivery = true; break;
        case "double_points":
            earnMultiplier = val || 2; break;
    }

    return { discountAmount, isFreeDelivery, earnMultiplier };
}

// ---------------------------------------------------------------------------
// LIST ORDERS
// ---------------------------------------------------------------------------
export const listOrders: RequestHandler = async (req, res) => {
    const query = req.query as Record<string, string | undefined>;
    const { page, limit, skip } = req.pagination;
    const user = req.user!;

    const where: Record<string, any> = {};
    if (user.role === "customer") {
        where.customerId = user.id;
    } else if (user.role === "agent") {
        where.agentId = user.id;
    } else {
        if (query.customerId) where.customerId = query.customerId;
        if (query.agentId) where.agentId = query.agentId;
    }
    if (query.status) where.status = query.status;

    const [orders, totalCount] = await Promise.all([
        prisma.order.findMany({ where, skip, take: limit, include: { items: true, qrCode: true }, orderBy: { createdAt: "desc" } }),
        prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).send({
        success: true,
        data: orders,
        pagination: { page, limit, totalCount, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 },
    });
};

// ---------------------------------------------------------------------------
// GET ORDER
// ---------------------------------------------------------------------------
export const getOrder: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const order = await prisma.order.findUnique({ where: { id }, include: { items: true, qrCode: true } });
    if (!order) throw new CustomError("Order not found", 404, true);
    res.status(200).send({ success: true, data: order });
};

// ---------------------------------------------------------------------------
// PREVIEW ORDER  (dry-run — no DB writes)
// ---------------------------------------------------------------------------
export const previewOrder: RequestHandler = async (req, res) => {
    const customerId = req.user!.id;
    const { items, walletRedeemed = 0 } = req.validatedBody;

    const { variants, variantIds } = await buildLineItems(items);

    const customer = await prisma.user.findUnique({
        where: { id: customerId },
        select: { walletBalance: true, tier: { select: { earnMultiplier: true } } },
    });

    const tierMultiplier = customer?.tier?.earnMultiplier ?? 1.0;
    let totalAmount = 0;
    let baseWalletEarned = 0;
    const lineItems = [];

    for (const item of items) {
        const variant = variants.find((v) => v.id === item.variantId)!;
        const subtotal = parseFloat((variant.price * item.quantity).toFixed(2));
        const earned = parseFloat((variant.earnValue * item.quantity).toFixed(2));
        totalAmount += subtotal;
        baseWalletEarned += earned;
        lineItems.push({
            variantId: variant.id,
            productId: variant.product.id,
            productName: variant.product.name,
            category: variant.product.category.name,
            weightLabel: variant.weightLabel,
            unitPrice: variant.price,
            earnValue: variant.earnValue,
            quantity: item.quantity,
            subtotal,
            earnedForLine: earned,
            images: variant.image,
            remainingStock: variant.stockQty - item.quantity,
        });
    }

    totalAmount = parseFloat(totalAmount.toFixed(2));

    const promotion = await findApplicablePromotion(customerId, variantIds);
    const { discountAmount, isFreeDelivery, earnMultiplier } = applyPromotion(promotion, totalAmount);

    const finalAmount = parseFloat((totalAmount - discountAmount).toFixed(2));
    const walletEarned = parseFloat((baseWalletEarned * tierMultiplier * earnMultiplier).toFixed(2));
    const walletBalance = customer?.walletBalance ?? 0;
    const effectiveRedemption = Math.min(walletRedeemed, walletBalance, finalAmount);

    res.status(200).send({
        success: true,
        data: {
            lineItems,
            totalAmount,
            discountAmount,
            finalAmount,
            isFreeDelivery,
            walletEarned,
            walletRedeemed: effectiveRedemption,
            amountDue: parseFloat((finalAmount - effectiveRedemption).toFixed(2)),
            promotion: promotion
                ? { id: promotion.id, name: promotion.name, type: promotion.type, discountValue: promotion.discountValue }
                : null,
        },
    });
};

// ---------------------------------------------------------------------------
// CREATE ORDER
// ---------------------------------------------------------------------------
export const createOrder: RequestHandler = async (req, res) => {
    const customerId = req.user!.id;
    const { agentId, placedBy, items, walletRedeemed = 0, deliveryAddress, notes } = req.validatedBody;

    const agent = await prisma.user.findUnique({ where: { id: agentId }, select: { id: true, role: true } });
    if (!agent || !["agent", "admin", "officer"].includes(agent.role ?? "")) {
        throw new CustomError("Invalid agent", 400, true);
    }

    const { variants, variantIds } = await buildLineItems(items);

    const customer = await prisma.user.findUnique({
        where: { id: customerId },
        select: { walletBalance: true, tier: { select: { earnMultiplier: true } } },
    });
    if (!customer) throw new CustomError("Customer not found", 404, true);

    const tierMultiplier = customer.tier?.earnMultiplier ?? 1.0;
    let totalAmount = 0;
    let baseWalletEarned = 0;
    const lineItems: { variant: (typeof variants)[number]; item: { variantId: string; quantity: number }; subtotal: number }[] = [];

    for (const item of items) {
        const variant = variants.find((v) => v.id === item.variantId)!;
        const subtotal = parseFloat((variant.price * item.quantity).toFixed(2));
        const earned = parseFloat((variant.earnValue * item.quantity).toFixed(2));
        totalAmount += subtotal;
        baseWalletEarned += earned;
        lineItems.push({ variant, item, subtotal });
    }

    totalAmount = parseFloat(totalAmount.toFixed(2));

    const promotion = await findApplicablePromotion(customerId, variantIds);
    const { discountAmount, isFreeDelivery, earnMultiplier } = applyPromotion(promotion, totalAmount);

    const finalAmount = parseFloat((totalAmount - discountAmount).toFixed(2));
    const walletEarned = parseFloat((baseWalletEarned * tierMultiplier * earnMultiplier).toFixed(2));

    if (walletRedeemed > 0) {
        if (customer.walletBalance < walletRedeemed) throw new CustomError("Insufficient wallet balance", 400, true);
        if (walletRedeemed > finalAmount) throw new CustomError("Cannot redeem more than the order total", 400, true);
    }

    const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
            data: {
                customerId, agentId, placedBy, status: "pending",
                totalAmount, discountAmount,
                finalAmount: parseFloat((finalAmount - walletRedeemed).toFixed(2)),
                isFreeDelivery, walletEarned, walletRedeemed, deliveryAddress, notes,
                items: {
                    create: lineItems.map(({ variant, item, subtotal }) => ({
                        variantId: variant.id,
                        productId: variant.product.id,
                        productName: variant.product.name,
                        weightLabel: variant.weightLabel,
                        productPrice: variant.price,
                        earnValue: variant.earnValue,
                        quantity: item.quantity,
                        subtotal,
                    })),
                },
            },
            include: { items: true },
        });

        const qrCode = await tx.qRCode.create({
            data: {
                orderId: newOrder.id, customerId, agentId,
                code: randomUUID(),
                expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
                amountToCredit: walletEarned,
            },
        });

        if (walletRedeemed > 0) {
            const fresh = await tx.user.findUnique({ where: { id: customerId }, select: { walletBalance: true } });
            await tx.walletTransaction.create({
                data: {
                    customerId, type: "redeemed", amount: -walletRedeemed,
                    balance: (fresh?.walletBalance ?? 0) - walletRedeemed,
                    description: `Wallet redeemed for order #${newOrder.id}`, orderId: newOrder.id,
                },
            });
            await tx.user.update({ where: { id: customerId }, data: { walletBalance: { decrement: walletRedeemed } } });
        }

        for (const { variant, item } of lineItems) {
            const newQty = variant.stockQty - item.quantity;
            await tx.productVariant.update({ where: { id: variant.id }, data: { stockQty: newQty, isOutOfStock: newQty <= 0 } });
        }

        if (promotion) {
            await tx.promotion.update({ where: { id: promotion.id }, data: { usageCount: { increment: 1 } } });
        }

        return { ...newOrder, qrCode };
    });

    res.status(201).send({ success: true, data: order });
};

// ---------------------------------------------------------------------------
// UPDATE ORDER  (status transitions + side effects)
// ---------------------------------------------------------------------------
export const updateOrder: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { status, cancelReason, deliveryAddress, notes } = req.validatedBody;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: { include: { variant: true } },
            customer: { select: { walletBalance: true, totalSpend: true } },
        },
    });
    if (!order) throw new CustomError("Order not found", 404, true);

    const simpleUpdate: Record<string, any> = {};
    if (deliveryAddress !== undefined) simpleUpdate.deliveryAddress = deliveryAddress;
    if (notes !== undefined) simpleUpdate.notes = notes;

    if (!status || status === order.status) {
        const updated = await prisma.order.update({ where: { id }, data: simpleUpdate });
        return res.status(200).send({ success: true, data: updated });
    }

    const allowed: Record<string, string[]> = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["out_for_delivery", "cancelled"],
        out_for_delivery: ["delivered"],
        delivered: [], cancelled: [],
    };
    if (!allowed[order.status]?.includes(status)) {
        throw new CustomError(`Cannot transition order from '${order.status}' to '${status}'`, 400, true);
    }

    if (status === "confirmed") {
        const updated = await prisma.order.update({ where: { id }, data: { ...simpleUpdate, status, cashConfirmedAt: new Date() } });
        return res.status(200).send({ success: true, data: updated });
    }

    if (status === "out_for_delivery") {
        const updated = await prisma.order.update({ where: { id }, data: { ...simpleUpdate, status } });
        return res.status(200).send({ success: true, data: updated });
    }

    if (status === "delivered") {
        const updated = await prisma.$transaction(async (tx) => {
            const o = await tx.order.update({ where: { id }, data: { ...simpleUpdate, status, deliveredAt: new Date() } });

            if (order.walletEarned > 0) {
                const expiresAt = await getWalletExpiry();
                const fresh = await tx.user.findUnique({ where: { id: order.customerId }, select: { walletBalance: true } });
                await tx.walletTransaction.create({
                    data: {
                        customerId: order.customerId, type: "earned", amount: order.walletEarned,
                        balance: (fresh?.walletBalance ?? 0) + order.walletEarned,
                        description: `Earned from order #${order.id}`, orderId: order.id, expiresAt,
                    },
                });
                const newTotalSpend = (order.customer?.totalSpend ?? 0) + order.finalAmount;
                await tx.user.update({
                    where: { id: order.customerId },
                    data: { walletBalance: { increment: order.walletEarned }, totalSpend: { increment: order.finalAmount } },
                });
                await checkAndUpdateTier(tx, order.customerId, newTotalSpend);
            }
            return o;
        });
        return res.status(200).send({ success: true, data: updated });
    }

    if (status === "cancelled") {
        const updated = await prisma.$transaction(async (tx) => {
            const o = await tx.order.update({
                where: { id },
                data: { ...simpleUpdate, status, cancelledAt: new Date(), cancelReason },
            });

            if (order.walletRedeemed > 0) {
                const fresh = await tx.user.findUnique({ where: { id: order.customerId }, select: { walletBalance: true } });
                await tx.walletTransaction.create({
                    data: {
                        customerId: order.customerId, type: "manual_adjustment", amount: order.walletRedeemed,
                        balance: (fresh?.walletBalance ?? 0) + order.walletRedeemed,
                        description: `Wallet refund for cancelled order #${order.id}`, orderId: order.id,
                    },
                });
                await tx.user.update({ where: { id: order.customerId }, data: { walletBalance: { increment: order.walletRedeemed } } });
            }

            for (const item of order.items) {
                const newQty = (item.variant?.stockQty ?? 0) + item.quantity;
                await tx.productVariant.update({ where: { id: item.variantId }, data: { stockQty: newQty, isOutOfStock: false } });
            }

            return o;
        });
        return res.status(200).send({ success: true, data: updated });
    }
};

// ---------------------------------------------------------------------------
// DELETE ORDER
// ---------------------------------------------------------------------------
export const deleteOrder: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    await prisma.order.delete({ where: { id } });

    res.sendStatus(204);
}