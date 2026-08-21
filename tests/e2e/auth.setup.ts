import { test as setup, expect } from '@playwright/test';

setup("authenticate user", async ({page}) => {
    await page.goto("/login");

    const usernameInput = page.getByLabel("username");
    const passwordInput = page.getByLabel("password");

    await expect(async () => {
        await usernameInput.clear();``
        await passwordInput.clear();

        await usernameInput.fill("admin");
        await passwordInput.fill("password123");
        await page.getByRole("button", { name: /Log In/i }).click();
        
        await expect(page).toHaveURL("/admin");
        await expect(page.getByRole("heading", { name: "Welcome to the Secure Admin Panel" })).toBeVisible();

        await page.context().storageState({path: "playwright/.auth/user.json"})
    }).toPass()
})