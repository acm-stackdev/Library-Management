import { useState, useMemo } from "react";
import authService from "../../services/authService";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import FormError from "../ui/FormError";
import AuthRequirements from "../ui/AuthRequirements";
import { KeyRound, Lock } from "lucide-react";
import { useToast } from "../../context/useToast";

export default function ResetForm({
  step,
  setStep,
  email,
  token,
  setToken,
  onSuccess,
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!token) return setError("Please enter the code.");
      return setStep(2);
    }

    if (!allRequirementsMet) return setError("Please meet all requirements.");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");

    setLoading(true);
    try {
      await authService.resetPassword(email, token, password);
      toast.success("Password reset successfully!");
      onSuccess();
    } catch (err) {
      setError(typeof err === "string" ? err : "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 h-full flex flex-col">
      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
        <div className="flex-1 space-y-4">
          {step === 1 ? (
            <div className="space-y-4">
              <FormInput
                icon={KeyRound}
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Recovery code"
                required
                autoFocus
              />
              <p className="text-sm text-muted px-1">
                Enter the 6-digit code sent to <strong>{email}</strong>.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <FormInput
                  icon={Lock}
                  isPassword
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password"
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
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
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                required
              />
            </div>
          )}
          <FormError message={error} />
        </div>

        <div className="flex justify-end pt-8">
          <Button
            type="submit"
            isLoading={loading}
            variant="primary"
            size="lg"
            className="rounded-xl px-8"
          >
            {step === 1 ? "Next" : "Reset Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
