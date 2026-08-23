import test, { expect } from "@playwright/test";

test("checking login with invalid credentials", async ({ page }) => {
    await page.goto("/login");

    // TRICK: Click the input first to wait for React hydration to finish!
    await page.getByLabel("username").click();
    await page.getByLabel("username").fill("admin");
    
    await page.getByLabel("password").click();
    await page.getByLabel("password").fill("admin123");
    
    await page.getByRole("button", { name: /Log In/i }).click();

    await expect(page.getByRole("alert").filter({ hasText: "Invalid credentials" })).toBeVisible();
});

test("checking login with valid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("username").click();
    await page.getByLabel("username").fill("admin");
    
    await page.getByLabel("password").click();
    await page.getByLabel("password").fill("password123");
    
    await page.getByRole("button", { name: /Log In/i }).click();

    await expect(page).toHaveURL("/admin");
    await expect(page.getByText("Welcome to the Secure Admin Panel")).toBeVisible();
});