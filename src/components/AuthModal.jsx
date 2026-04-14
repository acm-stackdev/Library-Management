import { useState, useEffect } from "react";
import { X, ChevronLeft } from "lucide-react";
import LoginForm from "./auth/LoginForm";
import RegisterForm from "./auth/RegisterForm";
import RegistrationSuccess from "./auth/RegistrationSuccess";

export default function AuthModal({ isOpen, onClose }) {
  const [view, setView] = useState("login"); // 'login', 'register', 'success'
  const [step, setStep] = useState(1); // 1 or 2
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setView("login");
      setStep(1);
      setEmail("");
      setName("");
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setView(view === "login" ? "register" : "login");
      setStep(1);
    }
  };

  const toggleView = () => {
    setView(view === "login" ? "register" : "login");
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[450px] min-h-[500px] bg-card shadow-2xl rounded-3xl border border-border-subtle overflow-hidden z-100 flex flex-col animate-in zoom-in-95 duration-200">
        {/* Navigation Header */}
        <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10">
          {step > 1 || view === "register" ? (
            <button
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-muted text-muted transition-colors flex items-center gap-1 group"
              title="Back"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <div /> // Spacer
          )}
          
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Branding */}
        <div className="pt-12 pb-6 flex flex-col items-center space-y-4">
          <div className="flex flex-col items-center">
            <img src="/logo.png" alt="Library Hub" className="w-12 h-12 mb-2" />
            <h1 className="text-xl font-bold text-foreground">Library Hub</h1>
          </div>
          
          <div className="text-center px-8">
            <h2 className="text-2xl font-semibold text-foreground">
              {view === "login" ? (step === 1 ? "Sign in" : "Welcome") : 
               view === "register" ? (step === 1 ? "Create account" : "Set password") : 
               "Registration Successful"}
            </h2>
            <p className="text-sm text-muted mt-2">
              {view === "login" ? (step === 1 ? "Use your Library Hub Account" : email) :
               view === "register" ? (step === 1 ? "to continue to Library Hub" : email) :
               "Your account has been created."}
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-8 pb-10 flex flex-col">
          <div className="flex-1">
            {view === "login" && (
              <LoginForm 
                step={step} 
                setStep={setStep} 
                onSuccess={onClose} 
                email={email}
                setEmail={setEmail}
                toggleView={toggleView}
              />
            )}

            {view === "register" && (
              <RegisterForm 
                step={step} 
                setStep={setStep} 
                onRegisterSuccess={() => setView("success")}
                email={email}
                setEmail={setEmail}
                name={name}
                setName={setName}
                toggleView={toggleView}
              />
            )}

            {view === "success" && (
              <RegistrationSuccess onGoToLogin={() => { setView("login"); setStep(1); }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
