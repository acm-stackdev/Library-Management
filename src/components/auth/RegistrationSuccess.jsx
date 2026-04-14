import { MailCheck } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../Button";

export default function RegistrationSuccess({ onGoToLogin }) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      onGoToLogin();
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [onGoToLogin]);

  return (
    <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-center space-y-4 animate-in slide-in-from-bottom-2">
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
        <MailCheck className="w-8 h-8 text-green-500" />
      </div>
      <div className="space-y-2">
        <p className="text-green-600 font-bold text-lg">
          Registration successful!
        </p>
        <p className="text-sm text-green-600/80">
          Redirecting to login in {countdown} seconds...
        </p>
      </div>
      <Button
        variant="primary"
        className="w-full rounded-xl"
        onClick={onGoToLogin}
      >
        Go to Login Now
      </Button>
    </div>
  );
}
