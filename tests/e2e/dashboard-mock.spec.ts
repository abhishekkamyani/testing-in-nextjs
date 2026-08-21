import test, { expect } from "@playwright/test";

test("The Happy Path Intercept", async ({ page }) => {
    await page.route(/\/api\/stats/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            json: { activeUsers: 8450, revenue: 12500 }
        })
    });

    await page.goto("/dashboard");

    await expect(page.getByTestId("active-users")).toHaveText("8,450")
    await expect(page.getByTestId("revenue")).toHaveText("$12,500")
})

test("Simulating the Loading State", async ({ page }) => {
    await page.route(/\/api\/stats/, async (route) => {

        await new Promise(resolve => setTimeout(resolve, 1000));

        await route.fulfill({
            status: 200,
            json: []
        })
    })

    await page.goto('/dashboard');

    await expect(page.getByTestId("loading-spinner")).toBeVisible();
    await expect(page.getByTestId("loading-spinner")).toBeHidden();
})

test("The 500 Internal Server Error", async ({ page }) => {
    await page.route(/\/api\/stats/, async (route) => {
        await route.fulfill({
            status: 500
        })
    });

    await page.goto('/dashboard');

    // FIX: Filter out the hidden Next.js route announcer
    const errorAlert = page.getByRole("alert").filter({ hasText: "Failed to load dashboard statistics" });

    await expect(errorAlert).toBeVisible();
});