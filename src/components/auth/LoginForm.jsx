import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../Button";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm({ step, setStep, onSuccess, email, setEmail, toggleView, onForgot }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
      setError(err || "Login failed. Please check your credentials.");
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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-background border border-border-subtle focus:ring-2 focus:ring-accent outline-none transition-all duration-200 text-lg"
                placeholder="Email or phone"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            <p className="text-xs text-muted leading-relaxed">
              Not your computer? Use Guest mode to sign in privately.{" "}
              <a href="#" className="text-accent font-bold hover:underline">Learn more</a>
            </p>
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
              className="rounded-xl px-8 font-bold"
            >
              Next
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
          <div className="flex-1 space-y-6">
            <div className="space-y-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 pr-12 rounded-xl bg-background border border-border-subtle focus:ring-2 focus:ring-accent outline-none transition-all duration-200 text-lg"
                placeholder="Enter your password"
                required
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

            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            <div className="flex justify-start">
              <button
                type="button"
                onClick={onForgot}
                className="text-accent font-bold text-sm hover:underline underline-offset-4 transition-all"
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
              className="rounded-xl px-8 font-bold"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
