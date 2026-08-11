import { UserProfileHeader } from "@/components/UserProfileHeader";
import { AuthProvider } from "@/contexts/AuthContext";
import { useCounter } from "@/hooks/useCounter";
import { renderWithAuth } from "@/utils/renderWithAuth";
import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock next/navigation at the top level so UserProfileHeader doesn't crash on router hooks
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/dashboard",
}));

describe("Module 5 Suite", () => {
  it("should initialize, increment, and reset counter in custom hook", () => {
    const { result } = renderHook(() => useCounter(10));

    expect(result.current.count).toBe(10);

    act(() => {
      result.current.increment();
      // expect(result.current.count).toBe(11); Will fail here because states updates not finished
    });
    expect(result.current.count).toBe(11);

    act(() => {
      result.current.reset();
    });
    expect(result.current.count).toBe(10);
  });

  it("should throw an error when UserProfileHeader is used outside AuthProvider", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });

    expect(() => render(<UserProfileHeader />)).toThrow(
      "useAuth must be used within an AuthProvider"
    );

    consoleSpy.mockRestore();
  });

  it("should render path and login button when unauthenticated", () => {
    render(<UserProfileHeader />, { wrapper: AuthProvider });

    // 1. Assert rendered path text
    expect(screen.getByText("Current Path: /dashboard")).toBeInTheDocument();

    // 2. Assert log in button is visible
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("should navigate on unauthorized action", async () => {
    const user = userEvent.setup();
    render(<UserProfileHeader />, { wrapper: AuthProvider });
    const submitButton = screen.getByRole("button", { name: /log in/i });
    await user.click(submitButton);

    // expect(submitButton).not.toBeInTheDocument(); // will be failed
    // expect(useRouter().push).toHaveBeenCalledWith("/login"); // will be failed

    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("should check Authenticated Context State & Logout Flow", async () => {
    const user = userEvent.setup();
    renderWithAuth(<UserProfileHeader />, "Alex");

    expect(screen.getByText("Welcome, Alex")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /log out/i }));

    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();

    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});