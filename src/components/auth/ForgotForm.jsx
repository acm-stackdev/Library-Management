import { useState } from "react";
import authService from "../../services/authService";
import Button from "../Button";

export default function ForgotForm({ email, setEmail, onSuccess }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authService.forgetPassword(email);
      onSuccess();
    } catch (err) {
      console.error("Forgot password error:", err);
      const errorMessage =
        typeof err === "string"
          ? err
          : err.message || err.error || "Failed to send reset code.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 h-full flex flex-col">
      <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-background border border-border-subtle focus:ring-2 focus:ring-accent outline-none transition-all duration-200 text-lg"
              placeholder="Enter your email"
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          <p className="text-sm text-muted leading-relaxed">
            Enter the email address associated with your account and we'll send you a recovery code to reset your password.
          </p>
        </div>

        <div className="flex justify-end pt-8">
          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            size="lg"
            className="rounded-xl px-8 font-bold"
          >
            {loading ? "Sending..." : "Next"}
          </Button>
        </div>
      </form>
    </div>
  );
}
