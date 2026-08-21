import { DashboardPage } from "@/pages/DashboardPage";
import test, { expect } from "@playwright/test";

test("This test reads like plain English using your new POM.", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await page.route(/\/api\/stats/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            json: { activeUsers: 1020, revenue: 4530 }
        })
    })

    await dashboardPage.navigate();

    expect(await dashboardPage.getRevenueText()).toBe('$4,530');
})

test("Catch pixel-perfect styling changes automatically", async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveScreenshot('dashboard-snapshot.png');
})