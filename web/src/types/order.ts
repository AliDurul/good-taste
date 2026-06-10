export type OrderStatus =
    | "pending"
    | "confirmed"
    | "out_for_delivery"
    | "delivered"
    | "completed"
    | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed";

export type PaymentMethod = "cash" | "mobile_money" | "bank_transfer" | "wallet";

export type OrderPlacedBy = "customer" | "agent" | "officer";

export interface IOrderItem {
    id: string;
    orderId: string;
    productId: string;
    productName: string;
    productPrice: number;
    earnValue: number;
    quantity: number;
    subtotal: number;
}

export interface IQRCodeItemSummary {
    name: string;
    qty: number;
    subtotal: number;
}

export interface IQRCode {
    id: string;
    code: string;
    orderId: string;
    customerId: string;
    agentId: string;
    isUsed: boolean;
    usedAt: string | null;
    expiresAt: string;
    amountToCredit: number;
    totalAmount: number;
    orderReference: string;
    // stored as JSON string in the API
    itemsSummary: string | IQRCodeItemSummary[];
    createdAt: string;
}

export interface IOrder {
    id: string;
    customerId: string;
    agentId: string;
    status: OrderStatus;
    placedBy: OrderPlacedBy;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    isFreeDelivery: boolean;
    walletEarned: number;
    walletRedeemed: number;
    deliveryAddress: string | null;
    notes: string | null;
    confirmedAt: string | null;
    outForDeliveryAt: string | null;
    deliveredAt: string | null;
    completedAt: string | null;
    paymentConfirmedAt: string | null;
    paidAt: string | null;
    cancelledAt: string | null;
    cancelReason: string | null;
    items: IOrderItem[];
    qrCode: IQRCode | null;
    customer?: { name: string; } | null;
    agent?: { name: string; } | null;
    createdAt: string;
    updatedAt: string;
}

// PATCH /orders/:orderId/deliver — fresh QR returns the full payload,
// an already-active QR returns only { qrCode, expiresAt, pointsToCredit }
export interface IDeliverOrderData {
    orderId?: string;
    orderReference?: string;
    status?: OrderStatus;
    qrCode: string;
    expiresAt: string;
    totalAmount?: number;
    amountToCredit?: number;
    pointsToCredit?: number;
    itemsSummary?: IQRCodeItemSummary[] | string;
}

export interface IOrderPreviewLineItem {
    productId: string;
    productName: string;
    category: string;
    unitPrice: number;
    earnValue: number;
    quantity: number;
    subtotal: number;
    earnedForLine: number;
    images: string;
    remainingStock: number;
}

export interface IOrderPreviewData {
    lineItems: IOrderPreviewLineItem[];
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    isFreeDelivery: boolean;
    walletEarned: number;
    walletRedeemed: number;
    amountDue: number;
    promotion: {
        id: string;
        name: string;
        type: string;
        discountValue: number | null;
    } | null;
}
