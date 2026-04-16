import { useState } from "react";
import { X } from "lucide-react";
import { booksService } from "../../services/apiservices";
import { useToast } from "../../context/ToastContext";
import BookForm from "../books/BookForm";

export default function BookModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleCreateBook = async (formData) => {
    setLoading(true);
    try {
      await booksService.create(formData);
      toast.success("New book added to library!");
      onClose();
      window.dispatchEvent(new Event("bookCreated"));
    } catch (err) {
      toast.error("Failed to create book. Check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-background/30 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[550px] bg-card shadow-2xl rounded-[32px] border border-border-subtle z-110 animate-in zoom-in-95 duration-200">
        <div className="px-8 pt-8 pb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Add New Book</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 pt-2">
          <BookForm onSubmit={handleCreateBook} loading={loading} />
        </div>
      </div>
    </div>
  );
}
