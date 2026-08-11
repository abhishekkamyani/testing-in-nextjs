// orderService.ts

export interface OrderItem {
  price: number;
  quantity: number;
}

export interface OrderData {
  items: OrderItem[];
  discountCode?: string;
  currency: string;
}

export interface PaymentResult {
  success: boolean;
  error?: string;
}

export type PaymentGateway = (amount: number, currency: string) => Promise<PaymentResult>;
export type Logger = (message: string) => void;

export function calculateTotal(items: OrderItem[], discountCode?: string): number {
  if (!items || items.length === 0) {
    throw new Error("Cart cannot be empty");
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (discountCode === "SAVE10") {
    return subtotal * 0.9;
  }

  return subtotal;
}

export async function processOrder(
  orderData: OrderData,
  paymentGateway: PaymentGateway,
  logger: Logger
) {
  logger("Starting order processing...");

  const total = calculateTotal(orderData.items, orderData.discountCode);

  const paymentResult = await paymentGateway(total, orderData.currency);

  if (!paymentResult.success) {
    logger("Payment failed!");
    return { success: false, reason: paymentResult.error };
  }

  logger("Order processed successfully!");
  return {
    success: true,
    orderId: "ORD-999",
    totalCharged: total,
  };
}