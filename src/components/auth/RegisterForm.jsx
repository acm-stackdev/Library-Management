import { useState, useMemo } from "react";
import authService from "../../services/authService";
import Button from "../Button";
import { Eye, EyeOff, Check } from "lucide-react";

export default function RegisterForm({
  step,
  setStep,
  onRegisterSuccess,
  email,
  setEmail,
  name,
  setName,
  toggleView,
}) {
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
    if (name && email) {
      setStep(2);
      setError("");
    } else {
      setError("Please fill in all fields.");
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
      await authService.register(name, email, password);
      onRegisterSuccess();
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage =
        typeof err === "string"
          ? err
          : err.message || err.error || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 h-full flex flex-col">
      {step === 1 ? (
        <form onSubmit={handleNext} className="space-y-4 flex-1 flex flex-col">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-background border border-border-subtle focus:ring-2 focus:ring-accent outline-none transition-all duration-200 text-lg"
                placeholder="Name"
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-background border border-border-subtle focus:ring-2 focus:ring-accent outline-none transition-all duration-200 text-lg"
                placeholder="Email address"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-8">
            <button
              type="button"
              onClick={toggleView}
              className="text-accent font-bold text-sm hover:bg-accent/5 px-4 py-2 rounded-lg transition-all"
            >
              Sign in instead
            </button>
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
                placeholder="Password"
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
                placeholder="Confirm password"
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
              {loading ? "Creating account..." : "Register"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
