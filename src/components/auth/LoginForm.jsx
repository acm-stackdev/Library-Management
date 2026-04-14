import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../Button";

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground/80 px-1">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-5 py-4 rounded-2xl bg-background border border-border-subtle focus:ring-2 focus:ring-accent outline-none transition-all duration-200"
          placeholder="name@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground/80 px-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-5 py-4 rounded-2xl bg-background border border-border-subtle focus:ring-2 focus:ring-accent outline-none transition-all duration-200"
          placeholder="••••••••"
          required
        />
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
        className="w-full py-5 rounded-2xl font-bold shadow-lg"
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
