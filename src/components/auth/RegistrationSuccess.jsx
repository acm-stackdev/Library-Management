import { MailCheck } from "lucide-react";
import Button from "../Button";

export default function RegistrationSuccess({ onGoToLogin }) {
  return (
    <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-center space-y-4 animate-in slide-in-from-bottom-2">
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
        <MailCheck className="w-8 h-8 text-green-500" />
      </div>
      <p className="text-green-600 font-medium">
        Registration successful! Please check your email for a confirmation link.
      </p>
      <Button
        variant="primary"
        className="w-full rounded-xl"
        onClick={onGoToLogin}
      >
        Go to Login
      </Button>
    </div>
  );
}
