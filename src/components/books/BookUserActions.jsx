import { BookOpen } from "lucide-react";
import Button from "../ui/Button";

export default function BookUserActions({ onBorrow, loading }) {
  return (
    <div className="pt-6 border-t border-border-subtle">
      <Button
        variant="primary"
        icon={BookOpen}
        className="w-full rounded-2xl py-4 font-black shadow-xl shadow-accent/20 text-lg tracking-tight"
        onClick={onBorrow}
        isLoading={loading}
      >
        Borrow This Book
      </Button>
    </div>
  );
}
