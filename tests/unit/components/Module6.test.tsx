import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Modal } from "@/components/Modal";
import { ProblemChild } from "@/components/ProblemChild";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Modal & Error Boundary Suite", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render modal via portal and trigger dismissal on button click", async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Confirm Delete">
        Data
      </Modal>
    );

    expect(screen.getByRole("dialog", { name: "Confirm Delete" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close Modal" }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should dismiss modal when pressing the Escape key", async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Confirm Delete">
        Data
      </Modal>
    );

    await user.keyboard("{Escape}");

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should render fallback UI when Error Boundary catches a crash", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong.");

    consoleSpy.mockRestore();
  });

  it("should match external snapshot when modal is open", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Terms">
        <p>Rules...</p>
      </Modal>
    );

    expect(screen.getByRole("dialog")).toMatchSnapshot();
  });

  it("should match inline snapshot when modal is closed", () => {
    const { container } = render(
      <Modal isOpen={false} onClose={mockOnClose} title="Hidden">
        <p>Hidden...</p>
      </Modal>
    );

    expect(container.firstChild).toMatchInlineSnapshot(`null`);
  });
});