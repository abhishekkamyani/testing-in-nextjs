import { render, screen } from "@testing-library/react";
import { UserProfileCard } from "@/components/UserProfileCard";

describe("UserProfileCard Component", () => {
  const defaultProps = {
    username: "alex",
    email: "alex@example.com",
    role: "admin" as const,
    profileUrl: "/users/alex",
    isAccountLocked: false,
  };

  it("should render main heading and profile link with correct href", () => {
    render(<UserProfileCard {...defaultProps} />);

    const heading = screen.getByRole("heading", { level: 1, name: /user profile/i });
    expect(heading).toBeInTheDocument();

    const profileLink = screen.getByRole("link", { name: /view full profile/i });
    expect(profileLink).toHaveAttribute("href", "/users/alex");
  });

  it("should associate label with email input and render initial value", () => {
    render(<UserProfileCard {...defaultProps} />);

    const input = screen.getByLabelText(/email address/i);
    expect(input).toHaveValue("alex@example.com");
  });

  it("should not render warning alert when account is unlocked", () => {
    render(<UserProfileCard {...defaultProps} isAccountLocked={false} />);

    const alert = screen.queryByRole("alert");
    expect(alert).not.toBeInTheDocument();
  });

  it("should render an enabled edit button when account is unlocked", () => {
    render(<UserProfileCard {...defaultProps} isAccountLocked={false} />);

    const button = screen.getByRole("button", { name: /edit profile/i });
    expect(button).not.toBeDisabled();
  });

  it("should render warning alert and disable edit button when account is locked", () => {
    render(<UserProfileCard {...defaultProps} isAccountLocked={true} />);

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /edit profile/i });
    expect(button).toBeDisabled();
  });
});