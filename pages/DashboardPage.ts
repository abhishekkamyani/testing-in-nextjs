import { Locator, Page } from "@playwright/test";

export class DashboardPage {
    readonly page: Page;
    readonly loadingSpinner: Locator;
    readonly activeUsers: Locator;
    readonly revenue: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loadingSpinner = page.getByTestId("loading-spinner");
        this.activeUsers = page.getByTestId("active-users");
        this.revenue = page.getByTestId("revenue");
    }

    async navigate() {
        await this.page.goto("/dashboard");
    }

    async getRevenueText() {
        // allInnerTexts vs allTextContents
        return await this.revenue.innerText();
    }
}