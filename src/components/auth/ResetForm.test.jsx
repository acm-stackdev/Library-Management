import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ResetForm from "./ResetForm";
import authService from "../../services/authService";
import { useToast } from "../../context/useToast";

vi.mock("../../services/authService", () => ({
  default: {
    resetPassword: vi.fn(),
  },
}));

vi.mock("../../context/useToast", () => ({
  useToast: vi.fn(),
}));

describe("ResetForm Component", () => {
  const mockSetStep = vi.fn();
  const mockSetToken = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockToast = { success: vi.fn(), error: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    useToast.mockReturnValue(mockToast);
  });

  it("renders Step 1 (Code) initially", () => {
    render(
      <ResetForm 
        step={1} 
        setStep={mockSetStep} 
        email="test@example.com" 
        token="" 
        setToken={mockSetToken} 
        onSuccess={mockOnSuccess} 
      />
    );
    expect(screen.getByPlaceholderText(/recovery code/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });

  it("transitions to Step 2 when code is provided", async () => {
    const user = userEvent.setup();
    render(
      <ResetForm 
        step={1} 
        setStep={mockSetStep} 
        email="test@example.com" 
        token="123456" 
        setToken={mockSetToken} 
        onSuccess={mockOnSuccess} 
      />
    );
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(mockSetStep).toHaveBeenCalledWith(2);
  });

  it("renders Step 2 (Password) when step is 2", () => {
    render(
      <ResetForm 
        step={2} 
        setStep={mockSetStep} 
        email="test@example.com" 
        token="123456" 
        setToken={mockSetToken} 
        onSuccess={mockOnSuccess} 
      />
    );
    expect(screen.getByPlaceholderText(/^new password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^confirm new password$/i)).toBeInTheDocument();
  });

  it("calls authService.resetPassword on valid submission", async () => {
    const user = userEvent.setup();
    authService.resetPassword.mockResolvedValueOnce({});
    
    render(
      <ResetForm 
        step={2} 
        setStep={mockSetStep} 
        email="test@example.com" 
        token="123456" 
        setToken={mockSetToken} 
        onSuccess={mockOnSuccess} 
      />
    );

    await user.type(screen.getByPlaceholderText(/^new password$/i), "Password123!");
    await user.type(screen.getByPlaceholderText(/confirm new password/i), "Password123!");
    
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    expect(authService.resetPassword).toHaveBeenCalledWith("test@example.com", "123456", "Password123!");
    expect(mockToast.success).toHaveBeenCalled();
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it("shows error if passwords do not match", async () => {
    const user = userEvent.setup();
    render(
      <ResetForm 
        step={2} 
        setStep={mockSetStep} 
        email="test@example.com" 
        token="123456" 
        setToken={mockSetToken} 
        onSuccess={mockOnSuccess} 
      />
    );

    await user.type(screen.getByPlaceholderText(/^new password$/i), "Password123!");
    await user.type(screen.getByPlaceholderText(/confirm new password/i), "Mismatch123!");
    
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });
});
