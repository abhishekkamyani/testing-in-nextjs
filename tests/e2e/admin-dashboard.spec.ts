import test, { expect } from "@playwright/test";

test.use({ storageState: "playwright/.auth/user.json" });

test("trying to access admin dashboard without going to login page", async ({ page }) => {
    await page.goto("/admin");

    await expect(page.getByText("Welcome to the Secure Admin Panel")).toBeVisible();
})

