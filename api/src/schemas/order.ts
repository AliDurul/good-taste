import z from "zod";

const orderItemSchema = z.object({
    variantId: z.string().uuid(),
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
