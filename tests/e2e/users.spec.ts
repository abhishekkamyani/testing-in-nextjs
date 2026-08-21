import test, { expect } from "@playwright/test";

test("Defeating the Hydration Race Condition", async ({ page }) => {
    // navigate to users -> fill input with Alice -> check block contains "Searching for: Alice"

    await page.goto("/users");
    const searchInput = page.getByPlaceholder("Type a name...")
    await expect(async () => {
        await searchInput.clear();

        await searchInput.fill("Alice");
        await expect(page.getByTestId("search-echo")).toHaveText("Searching for: Alice", { timeout: 500 });
    }).toPass()
})

test("Waiting for a Real API Response", async ({ page }) => {
    // navigate to users -> Set up a waitForResponse -> click Load Random User btn -> await response -> check loaded-user

    await page.goto("/users");

    // const responsePromise = page.waitForResponse(response =>
    //     response.url().includes("/users/1") && response.status() === 200
    // )

    // Alternative
    const responsePromise = page.waitForResponse(response =>
        response.url() === "https://jsonplaceholder.typicode.com/users/1" && response.status() === 200
    )

    await page.getByRole("button", {name: "Load Random User"}).click();

     // Pause the test until the API responds!
     await responsePromise;

     await expect(page.getByTestId("loaded-user")).toHaveText("Successfully loaded: Leanne Graham");
})

test("Verify <Link> navigation and dynamic URL matching.", async ({page}) => {
    // navigate to users -> Click the "View Admin Profile" link -> match the updated url
    
    await page.goto("/users");

    await page.getByRole("link", {name: "View Admin Profile"}).click();

    await expect(page).toHaveURL(/\/users\/[a-zA-Z0-9-]+/);
})