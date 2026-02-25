import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormActions } from "../form-actions";

// Mock next/link since it requires Next.js runtime
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Eye: () => <svg data-testid="eye-icon" />,
}));

describe("FormActions", () => {
  const defaultProps = {
    isPending: false,
    submitText: "CREATE ITEM",
    onCancel: vi.fn(),
  };

  it("renders the submit button with custom text", () => {
    render(<FormActions {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: "CREATE ITEM" })
    ).toBeInTheDocument();
  });

  it("renders the cancel button", () => {
    render(<FormActions {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: "CANCEL" })
    ).toBeInTheDocument();
  });

  it("shows 'SAVING...' and disables submit when isPending is true", () => {
    render(<FormActions {...defaultProps} isPending={true} />);
    const submitButton = screen.getByRole("button", { name: "SAVING..." });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("calls onCancel when the cancel button is clicked", async () => {
    const onCancel = vi.fn();
    render(<FormActions {...defaultProps} onCancel={onCancel} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "CANCEL" }));

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("renders a view link when viewUrl is provided", () => {
    render(<FormActions {...defaultProps} viewUrl="/products/123" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/products/123");
    expect(screen.getByTestId("eye-icon")).toBeInTheDocument();
  });

  it("does not render a view link when viewUrl is omitted", () => {
    render(<FormActions {...defaultProps} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
