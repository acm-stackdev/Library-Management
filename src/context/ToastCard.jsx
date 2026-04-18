import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export function ToastCard({ toast, onClose }) {
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
