import React from "react";
import { NotificationBanner } from "@/components/NotificationBanner";
import { trackEvent } from "@/utils/analytics";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// 1. Top-Level Module Mocks
jest.mock("@/utils/analytics", () => ({
  trackEvent: jest.fn(),
}));

jest.mock("@/components/HeavyBadge", () => ({
  HeavyBadge: ({ label }: { label: string }) => (
    <span data-testid="stub-badge">{label}</span>
  ),
}));

describe("Testing NotificationBanner Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Stub window.scrollTo globally to prevent JSDOM errors across all tests
    window.scrollTo = jest.fn();
  });

  it("should track banner_rendered on initial mount", () => {
    render(<NotificationBanner message="Maintenance at 12 AM" />);
    expect(trackEvent).toHaveBeenCalledWith("banner_rendered");
  });

  it("should render the stubbed HeavyBadge component", () => {
    render(<NotificationBanner message="Maintenance at 12 AM" />);
    expect(screen.getByTestId("stub-badge")).toHaveTextContent("NEW");
  });

  it("should spy on window.scrollTo when close button is clicked", async () => {
    const user = userEvent.setup();

    render(<NotificationBanner message="Maintenance at 12 AM" />);
    await user.click(screen.getByRole("button", { name: /close/i }));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("should call onDismiss callback and track manual closure", async () => {
    const user = userEvent.setup();
    const mockOnDismiss = jest.fn();

    render(
      <NotificationBanner
        message="Maintenance at 12 AM"
        onDismiss={mockOnDismiss}
      />
    );

    await user.click(screen.getByRole("button", { name: /close/i }));

    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    expect(trackEvent).toHaveBeenCalledWith("banner_closed_manual");
  });

  describe("Auto-Dismiss with Fake Timers", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should auto-dismiss banner and track auto-closure after timer expires", () => {
      render(
        <NotificationBanner message="Maintenance at 12 AM" autoDismissMs={3000} />
      );

      expect(screen.getByRole("region")).toBeInTheDocument();

      // Wrap timer advancement in act() to flush React state updates & re-renders
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(screen.queryByRole("region")).not.toBeInTheDocument();
      expect(trackEvent).toHaveBeenCalledWith("banner_closed_auto");
    });
  });
});