import { useState, useMemo } from "react";
import authService from "../../services/authService";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import FormError from "../ui/FormError";
import AuthRequirements from "../ui/AuthRequirements";
import { User, Mail, Lock } from "lucide-react";
import { useToast } from "../../context/ToastContext";

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
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // ── Password Requirement Logic ──
  const requirements = useMemo(
    () => [
      { label: "At least 6 characters", met: password.length >= 6 },
      { label: "One uppercase letter", met: /[A-Z]/.test(password) },
      { label: "One digit ('0'-'9')", met: /[0-9]/.test(password) },
      { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
    ],
    [password],
  );

  const allRequirementsMet = requirements.every((req) => req.met);

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
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.register(name, email, password);
      toast.success(
        "Registration successful! Please check your email for verification.",
      );
      onRegisterSuccess();
    } catch (err) {
      const errorMessage =
        typeof err === "string" ? err : "Registration failed.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 h-full flex flex-col">
      {step === 1 ? (
        <form onSubmit={handleNext} className="space-y-4 flex-1 flex flex-col">
          <div className="flex-1 space-y-4">
            <FormInput
              icon={User}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              autoFocus
            />
            <FormInput
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
            />
            <FormError message={error} />
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
              className="rounded-xl px-8"
            >
              Next
            </Button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex-1 flex flex-col"
        >
          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <FormInput
                icon={Lock}
                isPassword
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                placeholder="Create Password"
                togglePassword={() => setShowPassword(!showPassword)}
                required
                autoFocus
              />
              <AuthRequirements
                requirements={requirements}
                isVisible={
                  isPasswordFocused ||
                  (password.length > 0 && !allRequirementsMet)
                }
              />
            </div>

            <FormInput
              icon={Lock}
              isPassword
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              togglePassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              required
            />

            <FormError message={error} />
          </div>

          <div className="flex justify-end pt-8">
            <Button
              type="submit"
              disabled={loading || !allRequirementsMet}
              variant="primary"
              size="lg"
              className="rounded-xl px-8"
            >
              {loading ? "Creating..." : "Register"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
