import { useState } from "react";
import authService from "../../services/authService";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import FormError from "../ui/FormError";
import { Mail } from "lucide-react";
import { useToast } from "../../context/useToast";

export default function ForgotForm({ email, setEmail, onSuccess }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authService.forgetPassword(email);
      toast.success("Recovery code sent to your email!");
      onSuccess();
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to send code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 h-full flex flex-col">
      <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
        <div className="flex-1 space-y-6">
          <FormInput
            icon={Mail}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            autoFocus
          />
          <FormError message={error} />

          <p className="text-sm text-muted leading-relaxed px-1">
            We'll send a recovery code to this email so you can reset your
            password safely.
          </p>
        </div>

        <div className="flex justify-end pt-8">
          <Button
            type="submit"
            isLoading={loading}
            variant="primary"
            size="lg"
            className="rounded-xl px-8"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}
