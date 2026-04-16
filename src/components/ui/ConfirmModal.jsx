import { AlertTriangle } from "lucide-react";
import Button from "./Button";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/30 backdrop-blur-md"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[400px] bg-card shadow-2xl rounded-[32px] border border-border-subtle z-110 animate-in zoom-in-95 duration-200 p-8 flex flex-col items-center text-center">
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-6">
          <AlertTriangle size={32} strokeWidth={2.5} />
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 rounded-xl"
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            isLoading={loading}
            className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white border-none shadow-lg shadow-red-500/20 transition-all"
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
