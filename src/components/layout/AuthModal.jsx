import { useState, useEffect } from "react";
import { X, ChevronLeft } from "lucide-react";
import { useToast } from "../../context/ToastContext";

// Forms
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";
import ForgotForm from "../auth/ForgotForm";
import ResetForm from "../auth/ResetForm";

export default function AuthModal({ isOpen, onClose }) {
  const [view, setView] = useState("login"); // 'login', 'register', 'forgot', 'reset'
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");

  const toast = useToast();

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // ── Handlers ──
  const handleModalClose = () => {
    onClose();
    // Reset state after a brief delay so the user doesn't see the "flip" while closing
    setTimeout(() => {
      setView("login");
      setStep(1);
      setEmail("");
      setName("");
      setToken("");
    }, 200);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      if (view === "forgot") {
        setView("login");
        setStep(2); // Go back to the password step of login
      } else if (view === "reset") {
        setView("forgot");
        setStep(1);
      } else {
        setView(view === "login" ? "register" : "login");
        setStep(1);
      }
    }
  };

  // ── Dynamic UI Text ──
  const getModalText = () => {
    switch (view) {
      case "login":
        return {
          title: step === 1 ? "Sign in" : "Welcome back",
          subtitle: step === 1 ? "Use your Library Hub Account" : email,
        };
      case "register":
        return {
          title: step === 1 ? "Create account" : "Set password",
          subtitle: step === 1 ? "Join our library community" : email,
        };
      case "forgot":
        return {
          title: "Account recovery",
          subtitle: "We'll help you get back into your account",
        };
      case "reset":
        return {
          title: "Reset password",
          subtitle:
            step === 1 ? "Enter recovery code" : "Create a new password",
        };
      default:
        return { title: "Library Hub", subtitle: "" };
    }
  };

  const { title, subtitle } = getModalText();

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      {/* Premium Backdrop */}
      <div
        className="fixed inset-0 bg-background/30 backdrop-blur-md transition-opacity duration-300"
        onClick={handleModalClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[450px] bg-card shadow-2xl rounded-[32px] border border-border-subtle overflow-hidden z-110 flex flex-col animate-in zoom-in-95 duration-200 h-fit max-h-[90vh]">
        {/* Navigation Header */}
        <div className="absolute top-6 inset-x-6 flex justify-between items-center z-20">
          {step > 1 || view !== "login" ? (
            <button
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleModalClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Branding & Header */}
        <div className="pt-14 pb-8 flex flex-col items-center">
          <img src="/logo.png" alt="Logo" className="w-14 h-14 mb-4" />
          <div className="text-center px-8 space-y-1">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 px-8 pb-10 overflow-y-auto custom-scrollbar">
          {view === "login" && (
            <LoginForm
              step={step}
              setStep={setStep}
              onSuccess={handleModalClose}
              email={email}
              setEmail={setEmail}
              toggleView={() => {
                setView("register");
                setStep(1);
              }}
              onForgot={() => {
                setView("forgot");
                setStep(1);
              }}
            />
          )}

          {view === "register" && (
            <RegisterForm
              step={step}
              setStep={setStep}
              onRegisterSuccess={() => {
                toast.success("Account created! Please sign in.");
                setView("login");
                setStep(1);
              }}
              email={email}
              setEmail={setEmail}
              name={name}
              setName={setName}
              toggleView={() => {
                setView("login");
                setStep(1);
              }}
            />
          )}

          {view === "forgot" && (
            <ForgotForm
              email={email}
              setEmail={setEmail}
              onSuccess={() => setView("reset")}
            />
          )}

          {view === "reset" && (
            <ResetForm
              step={step}
              setStep={setStep}
              email={email}
              token={token}
              setToken={setToken}
              onSuccess={() => {
                setView("login");
                setStep(1);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
