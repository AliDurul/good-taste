import z from "zod";

const orderItemSchema = z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
});

export const orderPreviewSchema = z
    .object({
        items: z.array(orderItemSchema).min(1),
        walletRedeemed: z.number().nonnegative().default(0),
    })
    .strict();

export type OrderPreview = z.infer<typeof orderPreviewSchema>;

export const orderCreateSchema = z
    .object({
        agentId: z.string().uuid(),
        placedBy: z.enum(["customer", "agent"]),
        items: z.array(orderItemSchema).min(1),
        walletRedeemed: z.number().nonnegative().default(0),
        deliveryAddress: z.string().optional(),
        notes: z.string().optional(),
    })
    .strict();

export type OrderCreate = z.infer<typeof orderCreateSchema>;

// Web dashboard create form — admin/officer place orders on behalf of a customer.
// The API infers placedBy from the session role; agentId is only used as a
// fallback when the customer has no assigned agent.
export const orderCreateFormSchema = z.object({
    customerId: z.string().uuid({ message: "Select a customer" }),
    agentId: z.string().uuid().optional(),
    items: z.array(orderItemSchema).min(1, "Add at least one item"),
    walletRedeemed: z.number().nonnegative().default(0),
    paymentStatus: z.enum(["pending", "paid"]).default("pending"),
    paymentMethod: z.enum(["cash", "mobile_money", "bank_transfer", "wallet"]).default("cash"),
    deliveryAddress: z.string().optional(),
    notes: z.string().optional(),
});

export type OrderCreateForm = z.infer<typeof orderCreateFormSchema>;

export const orderCancelSchema = z.object({
    cancelReason: z.string().min(3, "Please provide a reason (min 3 characters)"),
});

export type OrderCancel = z.infer<typeof orderCancelSchema>;

export const orderUpdateSchema = z
    .object({
        status: z
            .enum(["pending", "confirmed", "out_for_delivery", "delivered", "cancelled"])
            .optional(),
        cancelReason: z.string().min(3).optional(),
        deliveryAddress: z.string().optional(),
        notes: z.string().optional(),
    })
    .strict()
    .refine(
        (data) => data.status !== "cancelled" || !!data.cancelReason,
        { message: "cancelReason is required when cancelling an order", path: ["cancelReason"] }
    );

export type OrderUpdate = z.infer<typeof orderUpdateSchema>;
