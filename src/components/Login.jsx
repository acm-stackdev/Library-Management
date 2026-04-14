import { useState, useEffect } from "react";
import { LogIn, X, UserPlus } from "lucide-react";
import LoginForm from "./auth/LoginForm";
import RegisterForm from "./auth/RegisterForm";
import RegistrationSuccess from "./auth/RegistrationSuccess";
import Button from "./Button";

export default function AuthModal({ isOpen, onClose }) {
  const [view, setView] = useState("login"); // 'login', 'register', 'success'

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setView("login");
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-card shadow-2xl rounded-3xl border border-border-subtle overflow-hidden z-100 animate-in zoom-in-95 duration-200">
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-start">
            <div className="flex flex-col space-y-1">
              <div className="p-3 bg-accent/10 rounded-2xl w-fit">
                {view === "register" ? (
                  <UserPlus className="w-8 h-8 text-accent" />
                ) : (
                  <LogIn className="w-8 h-8 text-accent" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-foreground pt-4">
                {view === "register" ? "Join Library Hub" : 
                 view === "success" ? "Check your Inbox" : "Welcome Back"}
              </h2>
              <p className="text-sm text-muted">
                {view === "register" ? "Create an account to manage your library" :
                 view === "success" ? "We've sent you a confirmation link" : "Please enter your details to sign in"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full p-2 hover:bg-muted"
              icon={X}
            />
          </div>

          {view === "login" && (
            <LoginForm onSuccess={onClose} />
          )}

          {view === "register" && (
            <RegisterForm onRegisterSuccess={() => setView("success")} />
          )}

          {view === "success" && (
            <RegistrationSuccess onGoToLogin={() => setView("login")} />
          )}

          {view !== "success" && (
            <p className="text-center text-sm text-muted">
              {view === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setView(view === "login" ? "register" : "login")}
                className="text-accent font-bold hover:underline decoration-2 underline-offset-4 transition-all"
              >
                {view === "login" ? "Register now" : "Log in here"}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
