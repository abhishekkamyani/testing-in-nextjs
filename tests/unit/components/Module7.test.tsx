import { UserProfileAxios, UserProfileFetcher } from "@/components/UserProfileFetcher";
import { server } from "@/mocks/server";
import { render, screen } from "@testing-library/react";
import axios from "axios";
import { http, HttpResponse } from "msw";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

// 1. Mock axios globally. 
// This will NOT break MSW because MSW is intercepting the <UserProfileFetcher> (which uses native fetch).
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
    jest.clearAllMocks();
});

// --- TEST CASE 1 ---
it("MSW Network Interception (Default Success)", async () => {
    render(<UserProfileFetcher userId="123" />);

    // Assert initial loading state renders
    expect(screen.getByText("Loading user details...")).toBeInTheDocument();

    // Wait for the mocked response to render
    expect(
        await screen.findByRole("heading", { name: "Alex Johnson" })
    ).toBeInTheDocument();
});

// --- TEST CASE 2 ---
it("MSW Runtime Error Override (server.use)", async () => {
    server.use(
        http.get("*/api/users/:userId", () => {
            return new HttpResponse(null, { status: 404 });
        })
    );

    render(<UserProfileFetcher userId="999" />);

    // Assert the error boundary is hit and contains the correct text
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("User not found");
});

// --- TEST CASE 3 ---
it("Legacy axios Success Mocking (jest.mock(\"axios\"))", async () => {
    // Configure the global mocked Axios instance
    mockedAxios.get.mockResolvedValueOnce({
        data: { username: "Axios User", email: "axios@example.com", role: "user" }
    });

    render(<UserProfileAxios userId="101" />);

    expect(
        await screen.findByRole("heading", { name: "Axios User" })
    ).toBeInTheDocument();
});

// --- TEST CASE 4 ---
it("Legacy axios Error Handling (mockRejectedValueOnce)", async () => {
    mockedAxios.get.mockRejectedValueOnce({
        response: { data: { message: "Axios Error: Network Timeout" } }
    });

    render(<UserProfileAxios userId="500" />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Axios Error: Network Timeout");
});

// --- TEST CASE 5 ---
it("Legacy global.fetch Mocking", async () => {
    // 1. Save the real fetch (from undici/MSW) before modifying it
    const originalFetch = global.fetch;

    // 2. Replace the native fetch with a Jest mock for this test only
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ username: "Fetch Legacy User", email: "fetch@example.com", role: "user" })
        })
    ) as jest.Mock;

    render(<UserProfileFetcher userId="202" />);

    expect(
        await screen.findByRole("heading", { name: "Fetch Legacy User" })
    ).toBeInTheDocument();

    // 3. Manually restore the original fetch so Test 6 can use MSW again!
    global.fetch = originalFetch;
    
    // Clean up Jest mock trackers
    jest.restoreAllMocks();
});

// --- TEST CASE 6 ---
it("Accessibility Check (jest-axe)", async () => {
    const { container } = render(<UserProfileFetcher userId="123" />);

    // 1. Wait for the MSW network request to resolve and the UI to update
    await screen.findByRole("heading", { name: "Alex Johnson" });

    // 2. NOW run the accessibility check on the fully rendered profile card
    const results = await axe(container);
    expect(results).toHaveNoViolations();
});