import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ForgotForm from "./ForgotForm";
import authService from "../../services/authService";
import { useToast } from "../../context/useToast";

vi.mock("../../services/authService", () => ({
  default: {
    forgetPassword: vi.fn(),
  },
}));

vi.mock("../../context/useToast", () => ({
  useToast: vi.fn(),
}));

describe("ForgotForm Component", () => {
  const mockSetEmail = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockToast = { success: vi.fn(), error: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    useToast.mockReturnValue(mockToast);
  });

  it("renders email input", () => {
    render(<ForgotForm email="" setEmail={mockSetEmail} onSuccess={mockOnSuccess} />);
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
  });

  it("calls authService.forgetPassword on valid submission", async () => {
    const user = userEvent.setup();
    authService.forgetPassword.mockResolvedValueOnce({});
    
    render(<ForgotForm email="test@example.com" setEmail={mockSetEmail} onSuccess={mockOnSuccess} />);
    
    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(authService.forgetPassword).toHaveBeenCalledWith("test@example.com");
    expect(mockToast.success).toHaveBeenCalled();
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it("handles error during submission", async () => {
    const user = userEvent.setup();
    authService.forgetPassword.mockRejectedValueOnce("User not found");
    
    render(<ForgotForm email="test@example.com" setEmail={mockSetEmail} onSuccess={mockOnSuccess} />);
    
    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(screen.getByText(/user not found/i)).toBeInTheDocument();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
