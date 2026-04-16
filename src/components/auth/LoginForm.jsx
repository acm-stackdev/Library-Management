import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import FormError from "../ui/FormError";
import { Mail, Lock } from "lucide-react";

export default function LoginForm({
  step,
  setStep,
  onSuccess,
  email,
  setEmail,
  toggleView,
  onForgot,
}) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailUnconfirmed, setIsEmailUnconfirmed] = useState(false);
  const { login } = useAuth();

  const handleNext = (e) => {
    e.preventDefault();
    if (email) {
      setStep(2);
      setError("");
    } else {
      setError("Please enter your email.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 403 || data?.code === "EMAIL_NOT_CONFIRMED") {
        setIsEmailUnconfirmed(true);
        setError(data?.message || "Please confirm your email first.");
      } else if (status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 h-full flex flex-col">
      {step === 1 ? (
        <form onSubmit={handleNext} className="space-y-6 flex-1 flex flex-col">
          <div className="flex-1 space-y-6">
            <FormInput
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or phone"
              required
              autoFocus
            />
            <FormError message={error} />
          </div>

          <div className="flex items-center justify-between pt-8">
            <button
              type="button"
              onClick={toggleView}
              className="text-accent font-bold text-sm hover:bg-accent/5 px-4 py-2 rounded-lg transition-all"
            >
              Create account
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
          className="space-y-6 flex-1 flex flex-col"
        >
          <div className="flex-1 space-y-6">
            <FormInput
              icon={Lock}
              isPassword
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              togglePassword={() => setShowPassword(!showPassword)}
              required
              autoFocus
            />
            <FormError message={error} />
            <div className="flex justify-start">
              <button
                type="button"
                onClick={onForgot}
                className="text-accent font-bold text-sm hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-8">
            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              size="lg"
              className="rounded-xl px-8"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
