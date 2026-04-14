import { useState } from "react";
import authService from "../../services/authService";
import Button from "../Button";

export default function RegisterForm({ onRegisterSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setError(err || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-bold uppercase tracking-wider text-muted px-1">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-5 py-3.5 rounded-2xl bg-background border border-border-subtle focus:ring-2 focus:ring-accent outline-none transition-all duration-200"
          placeholder="John Doe"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold uppercase tracking-wider text-muted px-1">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-5 py-3.5 rounded-2xl bg-background border border-border-subtle focus:ring-2 focus:ring-accent outline-none transition-all duration-200"
          placeholder="name@example.com"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted px-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3.5 rounded-2xl bg-background border border-border-subtle focus:ring-2 focus:ring-accent outline-none transition-all duration-200"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted px-1">
            Confirm
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-5 py-3.5 rounded-2xl bg-background border border-border-subtle focus:ring-2 focus:ring-accent outline-none transition-all duration-200"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-500/10 rounded-2xl border border-red-500/20">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        size="lg"
        className="w-full py-4 rounded-2xl font-bold shadow-lg mt-2"
      >
        {loading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
