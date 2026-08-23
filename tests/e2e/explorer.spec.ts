import test, { expect } from "@playwright/test";

test("verifies the page loads cleanly and all key elements are in place", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "TechMart Product Explorer" })).toBeVisible();
    await expect(page.getByTestId("product-card")).toHaveCount(5);
    await expect(page.getByText("Cart: 0 items")).toBeVisible();
})

test("Test text input entry and real-time DOM filtering.", async ({ page }) => {
    await page.goto("/");

    // await page.waitForTimeout(1000);

    // await page.getByLabel("Search Products").fill("keyboard");
    const searchInput = page.getByPlaceholder("Search by product title...");
    await expect(async () => {
        await searchInput.clear();
        await searchInput.fill("keyboard");
        await expect(page.getByTestId("results-count")).toHaveText("Showing 1 results", {timeout: 500})
    }).toPass()
    
    await expect(searchInput).toHaveValue("keyboard");
    await expect(page.getByRole("heading", { level: 3, name: "Mechanical Keyboard" })).toBeVisible();
})

test("Test clicking category buttons and checking multi-item updates.", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Audio", exact: true }).click();

    await expect(page.getByTestId("results-count")).toHaveText("Showing 2 results");

    await expect(page.getByTestId("product-card")).toHaveCount(2);

    await expect(page.getByRole("heading", { level: 3, name: "Wireless Noise-Canceling Headphones" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "Studio Microphone" })).toBeVisible();
})

test("Verify clicking interactive buttons, feedback alerts, and disabled states", async ({ page }) => {
    await page.goto("/");

    // await page.waitForTimeout(1000);

    // const keyboardCard = page.getByTestId("product-card").filter({ hasText: "Mechanical Keyboard" });
    const keyboardCard = page.getByTestId("product-card")
        .filter({ has: page.getByRole("heading", { level: 3, name: "Mechanical Keyboard" }) });

    await expect(async () => {
        await keyboardCard.getByRole("button", { name: "Add to cart" }).click();
        await expect(page.getByRole("status")).toBeVisible() // will pass
    }).toPass()

    // await expect(page.getByRole("status", {name: "Added Mechanical Keyboard to cart!"})).toBeVisible(); // will fail
    await expect(page.getByRole("status")).toHaveText("Added Mechanical Keyboard to cart!"); // recommended

    await expect(page.getByText("Cart: 1 item")).toBeVisible();

    const usbCard = page.getByTestId("product-card")
        .filter({ has: page.getByRole("heading", { level: 3, name: "USB-C Multiport Adapter" }) });
    await expect(usbCard).toBeVisible();
    await expect(usbCard.getByRole("button", { name: "Add to cart" })).toBeDisabled();
})

test("Verify error/empty handling and state clearing.", async ({ page }) => {
    await page.goto("/");

    // await page.waitForTimeout(1000);

    const searchInput = page.getByLabel("Search Products");

    await expect(async () => {
        await searchInput.clear();
        await searchInput.fill("Nonexistent Gadget");
        await expect(page.getByText("No products found matching your search criteria.")).toBeVisible({timeout: 500});
    }).toPass()
    
    
    await expect(searchInput).toHaveValue("Nonexistent Gadget");
    await page.getByRole("button", { name: "Reset Filters" }).click();

    await expect(page.getByTestId("product-card")).toHaveCount(5);
})