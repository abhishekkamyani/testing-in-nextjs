import test, { expect } from "@playwright/test";

test("settings.spec.ts", async ({ page }) => {
    await page.goto("/settings");

    const fileInput = page.getByLabel("Upload New Photo");

    await fileInput.setInputFiles("./tests/fixtures/avatar.png");

    await expect(page.getByTestId("upload-success")).toHaveText("Successfully uploaded: avatar.png")
})

test("Escaping the Iframe", async ({page}) => {
    await page.goto("/settings");

    const cardFrame = page.frameLocator('iframe[title="Secure Billing"]');

    await cardFrame.getByPlaceholder("Card Number").fill("4242 4242 4242");

    await cardFrame.getByRole("button", {name: "Save Card"}).click();

    await expect(cardFrame.getByText("Card linked successfully!")).toBeVisible();
})

test("The Multi-Tab Trap", async ({page, context}) => {
    await page.goto("/settings");

    const newTabPromise = context.waitForEvent("page");
    
    // await page.getByRole("link", {name: "Open API Documentation"}).click();
    await page.getByTestId("docs-link").click();

    const newPage = await newTabPromise;
    // await newPage.waitForLoadState();

    await expect(newPage).toHaveURL("https://playwright.dev/");

})