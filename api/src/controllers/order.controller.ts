import { randomUUID } from "crypto";
import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { CustomError } from "../lib/common";
import { applyPromotion, buildLineItems, checkAndUpdateTier, findApplicablePromotion, getWalletExpiry } from "../services/order.services";
import { OrderWhereInput } from "../../generated/prisma/models";
import { OrderStatus } from "../../generated/prisma/enums";


export const listOrders: RequestHandler = async (req, res) => {
    const query = req.query as Record<string, string | undefined>;
    const { page, limit, skip } = req.pagination;
    const user = req.user!;

    const where: OrderWhereInput = {};
    if (user.role === "customer") {
        where.customerId = user.id;
    } else if (user.role === "agent") {
        where.agentId = user.id;
    } else {
        if (query.customerId) where.customerId = query.customerId;
        if (query.agentId) where.agentId = query.agentId;
        if (query.search) where.OR = [
            { customer: { name: { contains: query.search, mode: "insensitive" } } },
            { agent: { name: { contains: query.search, mode: "insensitive" } } },
        ];
    }

    if (query.status) where.status = query.status as OrderStatus;


    const [orders, totalCount] = await Promise.all([
        prisma.order.findMany({
            where,
            skip,
            take: limit,
            include: { items: true, qrCode: true, customer: { select: { name: true } }, agent: { select: { name: true } } },
            orderBy: { createdAt: "desc" }
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
            hasPreviousPage: page > 1
        },
    });
};

export const getOrder: RequestHandler = async (req, res) => {

    const { id } = req.params;

    const order = await prisma.order.findUnique({ where: { id }, include: { items: true, qrCode: true, customer: { select: { name: true } }, agent: { select: { name: true } } } });

    if (!order) throw new CustomError("Order not found", 404, true);

    res.status(200).send({ success: true, data: order });
};

export const previewOrder: RequestHandler = async (req, res) => {
    const customerId = req.user!.id;
    const { items, walletRedeemed = 0 } = req.body;

    const { products, productIds } = await buildLineItems(items);

    const customer = await prisma.user.findUnique({
        where: { id: customerId },
        select: { walletBalance: true, tier: { select: { earnMultiplier: true } } },
    });


    const tierMultiplier = customer?.tier?.earnMultiplier ?? 1.0;
    let totalAmount = 0;
    let baseWalletEarned = 0;
    const lineItems = [];

    for (const item of items) {
        const product = products.find((p) => p.id === item.productId)!;
        const subtotal = parseFloat((product.price * item.quantity).toFixed(2));
        const earned = parseFloat((product.earnValue * item.quantity).toFixed(2));
        totalAmount += subtotal;
        baseWalletEarned += earned;
        lineItems.push({
            productId: product.id,
            productName: product.name,
            category: product.category.name,
            unitPrice: product.price,
            earnValue: product.earnValue,
            quantity: item.quantity,
            subtotal,
            earnedForLine: earned,
            images: product.image,
            remainingStock: product.stockQty - item.quantity,
        });
    }

    totalAmount = parseFloat(totalAmount.toFixed(2));

    const promotion = await findApplicablePromotion(customerId, productIds);
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

export const createOrder: RequestHandler = async (req, res) => {

    const placedBy = req.user!.role === "customer" ? "customer" : (req.user!.role === "agent" ? "agent" : "officer");
    const customerId = placedBy === "customer" ? req.user!.id : req.body.customerId;

    const customer = await prisma.user.findUnique({
        where: { id: customerId },
        select: { address: true, assignedAgentId: true, walletBalance: true, tier: { select: { earnMultiplier: true } } },
    });

    if (!customer) throw new CustomError("Customer not found", 404, true);

    const agentId = placedBy === "agent"
        ? req.user!.id
        : (customer?.assignedAgentId
            ? customer.assignedAgentId
            : req.body.agentId);


    const { items, walletRedeemed = 0, notes, deliveryAddress, paymentStatus, paymentMethod } = req.body;

    const { products, productIds } = await buildLineItems(items);

    const tierMultiplier = customer.tier?.earnMultiplier ?? 1.0;
    let totalAmount = 0;
    let baseWalletEarned = 0;
    const lineItems: { product: (typeof products)[number]; item: { productId: string; quantity: number }; subtotal: number }[] = [];

    for (const item of items) {
        const product = products.find((p) => p.id === item.productId)!;
        const subtotal = parseFloat((product.price * item.quantity).toFixed(2));
        const earned = parseFloat((product.earnValue * item.quantity).toFixed(2));
        totalAmount += subtotal;
        baseWalletEarned += earned;
        lineItems.push({ product, item, subtotal });
    }

    totalAmount = parseFloat(totalAmount.toFixed(2));

    const promotion = await findApplicablePromotion(customerId, productIds);
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
                customerId,
                agentId,
                placedBy,
                status: "pending",
                paymentStatus,
                paymentMethod,
                totalAmount,
                discountAmount,
                finalAmount: parseFloat((finalAmount - walletRedeemed).toFixed(2)),
                isFreeDelivery,
                walletEarned,
                walletRedeemed,
                deliveryAddress: deliveryAddress ?? customer.address,
                notes,
                items: {
                    create: lineItems.map(({ product, item, subtotal }) => ({
                        productId: product.id,
                        productName: product.name,
                        productPrice: product.price,
                        earnValue: product.earnValue,
                        quantity: item.quantity,
                        subtotal,
                    })),
                },
            },
            include: { items: true },
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

        // Decrement stock for each product
        for (const { product, item } of lineItems) {
            const newQty = product.stockQty - item.quantity;
            await tx.product.update({ where: { id: product.id }, data: { stockQty: newQty } });
        }

        if (promotion) {
            await tx.promotion.update({ where: { id: promotion.id }, data: { usageCount: { increment: 1 } } });
        }

        return { ...newOrder };
    });

    res.status(201).send({ success: true, data: order });
};

export const confirmOrder: RequestHandler = async (req, res) => {

    const isAdmin = req.user!.role === "admin" || req.user!.role === "officer";

    const { orderId } = req.params;
    const { id: agentId } = req.user!;

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true }
    });

    if (!order) {
        throw new CustomError("Order not found", 404, true);
    }

    if (order.agentId !== agentId && !isAdmin) {
        throw new CustomError("Not your order", 403, true);
    }

    if (order.status !== 'pending') {
        throw new CustomError(`Order must be pending (currently: ${order.status})`, 422, true);
    }

    await prisma.order.update({
        where: { id: orderId },
        data: {
            status: "confirmed",
            confirmedAt: new Date(),
        },
    })

    res.status(200).send({
        success: true,
        message: "Order confirmed.",

    });
}

export const deliverOrder: RequestHandler = async (req, res) => {

    const { orderId } = req.params;
    const { id: agentId } = req.user!;

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true }
    });

    if (!order) {
        throw new CustomError("Order not found", 404, true);
    }

    if (order.agentId !== agentId) {
        throw new CustomError("Not your order", 403, true);
    }

    if (!['confirmed', 'out_for_delivery'].includes(order.status)) {
        throw new CustomError(`Order must be confirmed or out for delivery (currently: ${order.status})`, 422, true);
    }


    // Check QR not already generated and still valid
    const existingQR = await prisma.qRCode.findUnique({ where: { orderId } });

    if (existingQR && !existingQR.isUsed && existingQR.expiresAt > new Date()) {
        return res.status(200).json({
            success: true,
            message: "QR already active for this order",
            data: {
                qrCode: existingQR.code,
                expiresAt: existingQR.expiresAt,
                pointsToCredit: existingQR.amountToCredit,
            },
        });
    }

    const itemsSummary = order.items.map((item) => ({
        name: item.productName,
        qty: item.quantity,
        subtotal: item.subtotal,
    }));

    const qrToken = `gt_${crypto.randomUUID()}`
    const orderReference = `GT${order.id.slice(0, 8).toUpperCase()}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.$transaction([
        prisma.order.update({
            where: { id: orderId },
            data: {
                status: "delivered",
                deliveredAt: new Date(),
                paymentConfirmedAt: order.paymentStatus === "pending" ? new Date() : undefined,
            },
        }),

        prisma.qRCode.create({
            data: {
                code: qrToken,
                orderId: order.id,
                customerId: order.customerId,
                agentId,
                expiresAt,
                amountToCredit: order.walletEarned,
                totalAmount: order.totalAmount,
                orderReference,
                itemsSummary: JSON.stringify(itemsSummary),
            },
        }),
    ])

    res.status(200).send({
        success: true,
        message: "Delivery confirmed. Show QR to customer for scanning.",
        data: {
            orderId: order.id,
            orderReference,
            status: "delivered",
            qrCode: qrToken,
            expiresAt,
            totalAmount: order.totalAmount,
            amountToCredit: order.walletEarned,
            itemsSummary,
        }
    });
}

export const scanQR: RequestHandler = async (req, res) => {

    const customerId = req.user?.id;

    const { code } = req.body;

    const qrCode = await prisma.qRCode.findUnique({ where: { code, customerId } });

    if (!qrCode) throw new CustomError("QR code not found", 404, true);

    if (qrCode.customerId !== customerId) throw new CustomError("This QR code is not for you", 403, true);

    if (qrCode.isUsed) throw new CustomError("QR code has already been used", 422, true);

    if (qrCode.expiresAt < new Date()) throw new CustomError("QR code has expired", 422, true);

    const order = await prisma.order.findUnique({ where: { id: qrCode.orderId } });

    if (!order) throw new CustomError("Associated order not found", 404, true);

    if (order.status !== "delivered") throw new CustomError("Order is not marked as delivered", 422, true);

    const earnsToAdd = qrCode.amountToCredit;
    const expiresAt = await getWalletExpiry();

    const result = await prisma.$transaction(async (tx) => {
        await tx.qRCode.update({
            where: { code, id: qrCode.id },
            data: { isUsed: true, usedAt: new Date() },
        });

        await tx.order.update({
            where: { id: qrCode.orderId },
            data: {
                status: "completed",
                completedAt: new Date(),
                paymentStatus: "paid",
                paidAt: new Date(),
            },
        });

        const customer = await tx.user.findUnique({
            where: { id: customerId },
            select: { walletBalance: true, totalSpend: true },
        });

        const newBalance = parseFloat((customer?.walletBalance as number + earnsToAdd).toFixed(2));
        const newTotalSpend = parseFloat((customer?.totalSpend as number + qrCode.totalAmount).toFixed(2));


        await tx.user.update({
            where: { id: customerId },
            data: {
                walletBalance: newBalance,
                totalSpend: newTotalSpend,
            },
        });

        await tx.walletTransaction.create({
            data: {
                customerId,
                type: "earned",
                amount: earnsToAdd,
                balance: newBalance,
                description: `Points earned for ${qrCode.orderReference}`,
                orderId: qrCode.orderId,
                expiresAt,
                isExpired: false,
            },
        });

        // Check and update loyalty tier
        const tierResult = await checkAndUpdateTier(tx, customerId, newBalance);


        return { newBalance, earnsToAdd, tierResult };
    });

    return res.status(200).json({
        success: true,
        message: "Order confirmed. Points credited to customer account.",
        data: {
            orderReference: qrCode.orderReference,
            status: "completed",
            paymentStatus: "paid",
            pointsEarned: result.earnsToAdd,
            newBalance: result.newBalance,
            receipt: qrCode.itemsSummary,
            tierChange: result.tierResult
                ? {
                    upgraded: result.tierResult.reason === "upgrade",
                    newTier: result.tierResult.newTier.name,
                    multiplier: result.tierResult.newTier.pointsMultiplier,
                }
                : null,
        },
    });

}

export const updateOrder: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { status, cancelReason, deliveryAddress, notes } = req.body;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: { include: { product: true } },
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
        const updated = await prisma.order.update({ where: { id }, data: { ...simpleUpdate, status, confirmedAt: new Date() } });
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
                const newQty = (item.product?.stockQty ?? 0) + item.quantity;
                await tx.product.update({ where: { id: item.productId }, data: { stockQty: newQty } });
            }

            return o;
        });
        return res.status(200).send({ success: true, data: updated });
    }
};

export const deleteOrder: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };

    await prisma.order.delete({ where: { id } });

    res.sendStatus(204);
}