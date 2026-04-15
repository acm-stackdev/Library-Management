import { useState, useMemo } from "react";
import authService from "../../services/authService";
import Button from "../Button";
import { Eye, EyeOff, Check } from "lucide-react";

export default function ResetForm({ step, setStep, email, token, setToken, onSuccess }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requirements = useMemo(() => [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "At least one uppercase ('A'-'Z')", met: /[A-Z]/.test(password) },
    { label: "At least one digit ('0'-'9')", met: /[0-9]/.test(password) },
    { label: "At least one special character", met: /[^A-Za-z0-9]/.test(password) },
  ], [password]);

  const allRequirementsMet = requirements.every(req => req.met);

  const handleNext = (e) => {
    e.preventDefault();
    if (token) {
      setStep(2);
      setError("");
    } else {
      setError("Please enter the recovery token.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allRequirementsMet) {
      setError("Please meet all password requirements.");
      return;
    }
    
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await authService.resetPassword(email, token, password);
      onSuccess();
    } catch (err) {
      console.error("Reset password error:", err);
      const errorMessage =
        typeof err === "string"
          ? err
          : err.message || err.error || "Failed to reset password.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 h-full flex flex-col">
      {step === 1 ? (
        <form onSubmit={handleNext} className="space-y-6 flex-1 flex flex-col">
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-background border border-border-subtle focus:ring-2 focus:ring-accent outline-none transition-all duration-200 text-lg"
                placeholder="Recovery code"
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
              We've sent a code to <strong>{email}</strong>. Enter it above to continue resetting your password.
            </p>
          </div>

          <div className="flex justify-end pt-8">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="rounded-xl px-8 font-bold"
            >
              Next
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
          <div className="flex-1 space-y-4">
            <div className="space-y-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 pr-12 rounded-xl bg-background border border-border-subtle focus:ring-2 focus:ring-accent outline-none transition-all duration-200 text-lg"
                placeholder="New password"
                required
                minLength={6}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Requirements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-1">
              {requirements.map((req, i) => (
                <div key={i} className={`flex items-center gap-2 text-[11px] font-medium transition-colors ${req.met ? "text-green-500" : "text-muted"}`}>
                  {req.met ? <Check size={12} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40 ml-1 mr-0.5" />}
                  {req.label}
                </div>
              ))}
            </div>

            <div className="space-y-2 relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3.5 pr-12 rounded-xl bg-background border border-border-subtle focus:ring-2 focus:ring-accent outline-none transition-all duration-200 text-lg"
                placeholder="Confirm new password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-8">
            <Button
              type="submit"
              disabled={loading || !allRequirementsMet}
              variant="primary"
              size="lg"
              className="rounded-xl px-8 font-bold"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
