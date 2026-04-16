import { Bookmark } from "lucide-react";
import Button from "./Button";

export default function ErrorState({ message, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center px-4">
      <div className="bg-red-500/10 p-6 rounded-full">
        <Bookmark className="w-12 h-12 text-red-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Book Not Found</h2>
        <p className="text-muted max-w-md">{message}</p>
      </div>
      <Button onClick={onBack} variant="primary" className="rounded-xl px-8">
        Back to Library
      </Button>
    </div>
  );
}
