import { NewsletterSignup } from "@/components/NewsLetterSignup";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("NewsletterSignup Component", () => {
    const mockOnSubscribe = jest.fn().mockResolvedValue(undefined);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize the form and toggle the checkbox", async () => {
        const user = userEvent.setup();
        render(<NewsletterSignup onSubscribe={mockOnSubscribe} />);

        const submitButton = screen.getByRole("button", { name: /subscribe/i });
        expect(submitButton).toBeDisabled();

        const emailInput = screen.getByLabelText(/email address/i);
        const termsCheckbox = screen.getByRole("checkbox", { name: /agree to the terms/i });

        await user.type(emailInput, "abhishek@example.com");
        await user.click(termsCheckbox);

        expect(submitButton).not.toBeDisabled();
    });

    test("should clear the input and validate the corrected value", async () => {
        const user = userEvent.setup();
        render(<NewsletterSignup onSubscribe={mockOnSubscribe} />);

        const emailInput = screen.getByLabelText(/email address/i);

        await user.type(emailInput, "wrong-email@example.com");
        await user.clear(emailInput);
        await user.type(emailInput, "correct@example.com");

        expect(emailInput).toHaveValue("correct@example.com");
    });

    test("should submit form successfully and display success message", async () => {
        const user = userEvent.setup();
        render(<NewsletterSignup onSubscribe={mockOnSubscribe} />);

        await user.type(screen.getByLabelText(/email address/i), "correct@example.com");
        await user.click(screen.getByRole("checkbox", { name: /agree to the terms/i }));

        const submitButton = screen.getByRole("button", { name: /subscribe/i });
        await user.click(submitButton);

        // 1. Assert mock call
        expect(mockOnSubscribe).toHaveBeenCalledWith("correct@example.com");

        // 2. Assert async status message using findByRole or findByText
        const statusMessage = await screen.findByRole("status");
        expect(statusMessage).toHaveTextContent("Thank you for subscribing!");
    });

    test("should display error message when subscription fails", async () => {
        const user = userEvent.setup();
        const mockOnSubscribe = jest.fn().mockRejectedValue(new Error("Server error"));
        render(<NewsletterSignup onSubscribe={mockOnSubscribe} />);

        await user.type(screen.getByLabelText(/email address/i), "correct@example.com");
        await user.click(screen.getByRole("checkbox", { name: /agree to the terms/i }));

        const submitButton = screen.getByRole("button", { name: /subscribe/i });
        await user.click(submitButton);

        // Assert error alert appears asynchronously
        const alert = await screen.findByRole("alert");
        expect(alert).toHaveTextContent(/failed to subscribe. please try again./i);
    });

    test("should re-enable submit button after submission failure", async () => {
        const user = userEvent.setup();
        const mockOnSubscribe = jest.fn().mockRejectedValue(new Error("Server error"));
        render(<NewsletterSignup onSubscribe={mockOnSubscribe} />);

        await user.type(screen.getByLabelText(/email address/i), "correct@example.com");
        await user.click(screen.getByRole("checkbox", { name: /agree to the terms/i }));

        const submitButton = screen.getByRole("button", { name: /subscribe/i });
        await user.click(submitButton);

        // Wait for error alert to appear to ensure submission cycle finished
        await screen.findByRole("alert");

        // Assert form returns to idle state and button is re-enabled
        expect(submitButton).toHaveTextContent(/subscribe/i);
        expect(submitButton).not.toBeDisabled();
    });

});
