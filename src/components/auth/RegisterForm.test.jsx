import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RegisterForm from "./RegisterForm";
import authService from "../../services/authService";
import { useToast } from "../../context/useToast";

// Mock services and hooks
vi.mock("../../services/authService", () => ({
  default: {
    register: vi.fn(),
  },
}));

vi.mock("../../context/useToast", () => ({
  useToast: vi.fn(),
}));

describe("RegisterForm Component", () => {
  const mockSetStep = vi.fn();
  const mockSetEmail = vi.fn();
  const mockSetName = vi.fn();
  const mockOnRegisterSuccess = vi.fn();
  const mockToggleView = vi.fn();
  const mockToast = {
    success: vi.fn(),
    error: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useToast.mockReturnValue(mockToast);
  });

  it("renders Step 1 (Name & Email) initially", () => {
    render(
      <RegisterForm
        step={1}
        setStep={mockSetStep}
        onRegisterSuccess={mockOnRegisterSuccess}
        email=""
        setEmail={mockSetEmail}
        name=""
        setName={mockSetName}
        toggleView={mockToggleView}
      />
    );

    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in instead/i })).toBeInTheDocument();
  });

  it("transitions to Step 2 when name and email are provided", async () => {
    const user = userEvent.setup();
    render(
      <RegisterForm
        step={1}
        setStep={mockSetStep}
        onRegisterSuccess={mockOnRegisterSuccess}
        email="test@example.com"
        setEmail={mockSetEmail}
        name="John Doe"
        setName={mockSetName}
        toggleView={mockToggleView}
      />
    );

    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(mockSetStep).toHaveBeenCalledWith(2);
  });

  it("shows error in Step 1 if fields are missing", async () => {
    render(
      <RegisterForm
        step={1}
        setStep={mockSetStep}
        onRegisterSuccess={mockOnRegisterSuccess}
        email=""
        setEmail={mockSetEmail}
        name=""
        setName={mockSetName}
        toggleView={mockToggleView}
      />
    );

    const form = screen.getByRole("button", { name: /next/i }).closest("form");
    fireEvent.submit(form);

    expect(await screen.findByText(/please fill in all fields/i)).toBeInTheDocument();
    expect(mockSetStep).not.toHaveBeenCalled();
  });

  it("renders Step 2 (Passwords) when step is 2", () => {
    render(
      <RegisterForm
        step={2}
        setStep={mockSetStep}
        onRegisterSuccess={mockOnRegisterSuccess}
        email="test@example.com"
        setEmail={mockSetEmail}
        name="John Doe"
        setName={mockSetName}
        toggleView={mockToggleView}
      />
    );

    expect(screen.getByPlaceholderText(/^create password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  it("shows password requirements when focusing password field", async () => {
    const user = userEvent.setup();
    render(
      <RegisterForm
        step={2}
        setStep={mockSetStep}
        onRegisterSuccess={mockOnRegisterSuccess}
        email="test@example.com"
        setEmail={mockSetEmail}
        name="John Doe"
        setName={mockSetName}
        toggleView={mockToggleView}
      />
    );

    const passwordInput = screen.getByPlaceholderText(/^create password$/i);
    await user.click(passwordInput);

    expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/one uppercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/one digit/i)).toBeInTheDocument();
    expect(screen.getByText(/one special character/i)).toBeInTheDocument();
  });

  it("enables register button only when requirements are met", async () => {
    const user = userEvent.setup();
    render(
      <RegisterForm
        step={2}
        setStep={mockSetStep}
        onRegisterSuccess={mockOnRegisterSuccess}
        email="test@example.com"
        setEmail={mockSetEmail}
        name="John Doe"
        setName={mockSetName}
        toggleView={mockToggleView}
      />
    );

    const registerButton = screen.getByRole("button", { name: /register/i });
    expect(registerButton).toBeDisabled();

    const passwordInput = screen.getByPlaceholderText(/^create password$/i);
    await user.type(passwordInput, "Password123!");

    expect(registerButton).not.toBeDisabled();
  });

  it("shows error if passwords do not match", async () => {
    const user = userEvent.setup();
    render(
      <RegisterForm
        step={2}
        setStep={mockSetStep}
        onRegisterSuccess={mockOnRegisterSuccess}
        email="test@example.com"
        setEmail={mockSetEmail}
        name="John Doe"
        setName={mockSetName}
        toggleView={mockToggleView}
      />
    );

    await user.type(screen.getByPlaceholderText(/^create password$/i), "Password123!");
    await user.type(screen.getByPlaceholderText(/confirm password/i), "Different123!");
    
    await user.click(screen.getByRole("button", { name: /register/i }));

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("calls authService.register and onSuccess on valid submission", async () => {
    const user = userEvent.setup();
    authService.register.mockResolvedValueOnce({});
    
    render(
      <RegisterForm
        step={2}
        setStep={mockSetStep}
        onRegisterSuccess={mockOnRegisterSuccess}
        email="test@example.com"
        setEmail={mockSetEmail}
        name="John Doe"
        setName={mockSetName}
        toggleView={mockToggleView}
      />
    );

    await user.type(screen.getByPlaceholderText(/^create password$/i), "Password123!");
    await user.type(screen.getByPlaceholderText(/confirm password/i), "Password123!");
    
    await user.click(screen.getByRole("button", { name: /register/i }));

    expect(authService.register).toHaveBeenCalledWith("John Doe", "test@example.com", "Password123!");
    expect(mockToast.success).toHaveBeenCalledWith(expect.stringContaining("successful"));
    expect(mockOnRegisterSuccess).toHaveBeenCalled();
  });

  it("handles registration error", async () => {
    const user = userEvent.setup();
    authService.register.mockRejectedValueOnce("Email already exists");
    
    render(
      <RegisterForm
        step={2}
        setStep={mockSetStep}
        onRegisterSuccess={mockOnRegisterSuccess}
        email="test@example.com"
        setEmail={mockSetEmail}
        name="John Doe"
        setName={mockSetName}
        toggleView={mockToggleView}
      />
    );

    await user.type(screen.getByPlaceholderText(/^create password$/i), "Password123!");
    await user.type(screen.getByPlaceholderText(/confirm password/i), "Password123!");
    
    await user.click(screen.getByRole("button", { name: /register/i }));

    expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    expect(mockToast.error).toHaveBeenCalledWith("Email already exists");
  });
});
