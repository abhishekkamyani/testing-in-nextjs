import { 
  calculateTotal, 
  processOrder, 
  OrderItem, 
  OrderData, 
  PaymentGateway, 
  Logger 
} from "@/services/orderService";

describe("calculateTotal", () => {
  it("should calculate the total for multiple items without a discount code", () => {
    // Arrange
    const items: OrderItem[] = [
      { price: 100, quantity: 2 },
      { price: 50, quantity: 1 },
    ];

    // Act
    const total = calculateTotal(items);

    // Assert
    expect(total).toBe(250);
  });

  it("should apply SAVE10 discount code correctly", () => {
    // Arrange
    const items: OrderItem[] = [{ price: 100, quantity: 1 }];

    // Act
    const total = calculateTotal(items, "SAVE10");

    // Assert
    expect(total).toBe(90);
  });

  it("should throw an error when the cart is empty", () => {
    // Act & Assert
    expect(() => calculateTotal([])).toThrow("Cart cannot be empty");
  });
});

describe("processOrder", () => {
  const items: OrderItem[] = [
    { price: 25, quantity: 2 },
    { price: 50, quantity: 1 },
  ];

  const orderData: OrderData = {
    items,
    currency: "USD",
  };

  it("should calculate the total and trigger paymentGateway and logger on success", async () => {
    // Arrange
    const paymentGateway: PaymentGateway = jest.fn().mockResolvedValue({ success: true });
    const logger: Logger = jest.fn();

    // Act
    await processOrder(orderData, paymentGateway, logger);

    // Assert
    expect(logger).toHaveBeenCalledTimes(2);
    expect(paymentGateway).toHaveBeenCalledWith(100, "USD");
  });

  it("should return a failure object when the payment fails", async () => {
    // Arrange
    const paymentGateway: PaymentGateway = jest.fn().mockResolvedValueOnce({
      success: false,
      error: "Insufficient funds",
    });
    const logger: Logger = jest.fn();

    // Act
    const result = await processOrder(orderData, paymentGateway, logger);

    // Assert
    expect(result).toEqual({ success: false, reason: "Insufficient funds" });
  });
});