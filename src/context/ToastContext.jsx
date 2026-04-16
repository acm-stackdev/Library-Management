import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
    info: (msg) => addToast(msg, "info"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-100 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

function ToastCard({ toast, onClose }) {
  const isError = toast.type === "error";
  const isSuccess = toast.type === "success";

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border pointer-events-auto animate-in slide-in-from-right-8 duration-300 ${
        isError
          ? "bg-red-500/10 border-red-500/20 text-red-500"
          : isSuccess
            ? "bg-green-500/10 border-green-500/20 text-green-500"
            : "bg-card border-border text-foreground"
      }`}
    >
      {isError ? (
        <AlertCircle className="w-5 h-5" />
      ) : isSuccess ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <Info className="w-5 h-5" />
      )}
      <p className="text-sm font-semibold">{toast.message}</p>
      <button
        onClick={onClose}
        className="ml-auto p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
