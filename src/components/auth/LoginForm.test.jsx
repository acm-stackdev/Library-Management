import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginForm from "./LoginForm";
import { useAuth } from "../../context/useAuth";

// Mock the useAuth hook
vi.mock("../../context/useAuth", () => ({
  useAuth: vi.fn(),
}));

describe("LoginForm Component", () => {
  const mockLogin = vi.fn();
  const mockSetStep = vi.fn();
  const mockSetEmail = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockToggleView = vi.fn();
  const mockOnForgot = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ login: mockLogin });
  });

  it("renders Step 1 (Email) initially", () => {
    render(
      <LoginForm
        step={1}
        setStep={mockSetStep}
        onSuccess={mockOnSuccess}
        email=""
        setEmail={mockSetEmail}
        toggleView={mockToggleView}
        onForgot={mockOnForgot}
      />,
    );

    expect(screen.getByPlaceholderText(/email or phone/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });

  it("transitions to Step 2 when email is provided and Next is clicked", async () => {
    const user = userEvent.setup();
    render(
      <LoginForm
        step={1}
        setStep={mockSetStep}
        onSuccess={mockOnSuccess}
        email="test@example.com"
        setEmail={mockSetEmail}
        toggleView={mockToggleView}
        onForgot={mockOnForgot}
      />,
    );

    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(mockSetStep).toHaveBeenCalledWith(2);
  });

  it("shows error in Step 1 if email is empty and Next is clicked", async () => {
    render(
      <LoginForm
        step={1}
        setStep={mockSetStep}
        onSuccess={mockOnSuccess}
        email=""
        setEmail={mockSetEmail}
        toggleView={mockToggleView}
        onForgot={mockOnForgot}
      />,
    );

    const form = screen.getByRole("button", { name: /next/i }).closest("form");
    fireEvent.submit(form);

    expect(
      await screen.findByText(/please enter your email/i),
    ).toBeInTheDocument();
    expect(mockSetStep).not.toHaveBeenCalled();
  });

  it("renders Step 2 (Password) when step is 2", () => {
    render(
      <LoginForm
        step={2}
        setStep={mockSetStep}
        onSuccess={mockOnSuccess}
        email="test@example.com"
        setEmail={mockSetEmail}
        toggleView={mockToggleView}
        onForgot={mockOnForgot}
      />,
    );

    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /forgot password/i }),
    ).toBeInTheDocument();
  });

  it("calls login and onSuccess when valid credentials are provided", async () => {
    mockLogin.mockResolvedValueOnce({});
    const user = userEvent.setup();

    render(
      <LoginForm
        step={2}
        setStep={mockSetStep}
        onSuccess={mockOnSuccess}
        email="test@example.com"
        setEmail={mockSetEmail}
        toggleView={mockToggleView}
        onForgot={mockOnForgot}
      />,
    );

    await user.type(
      screen.getByPlaceholderText(/enter password/i),
      "password123",
    );
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it("shows error message on failed login", async () => {
    mockLogin.mockRejectedValueOnce({
      response: { status: 401 },
    });
    const user = userEvent.setup();

    render(
      <LoginForm
        step={2}
        setStep={mockSetStep}
        onSuccess={mockOnSuccess}
        email="test@example.com"
        setEmail={mockSetEmail}
        toggleView={mockToggleView}
        onForgot={mockOnForgot}
      />,
    );

    await user.type(
      screen.getByPlaceholderText(/enter password/i),
      "wrong-password",
    );
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("shows specific error for unconfirmed email", async () => {
    mockLogin.mockRejectedValueOnce({
      response: {
        status: 403,
        data: { code: "EMAIL_NOT_CONFIRMED", message: "Confirm email" },
      },
    });
    const user = userEvent.setup();

    render(
      <LoginForm
        step={2}
        setStep={mockSetStep}
        onSuccess={mockOnSuccess}
        email="test@example.com"
        setEmail={mockSetEmail}
        toggleView={mockToggleView}
        onForgot={mockOnForgot}
      />,
    );

    await user.type(
      screen.getByPlaceholderText(/enter password/i),
      "password123",
    );
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(screen.getByText(/confirm email/i)).toBeInTheDocument();
  });
});
