import { useNavigate } from "react-router-dom";
import { BookDashed, ArrowLeft, Home } from "lucide-react";
import Button from "../components/ui/Button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="max-w-lg w-full text-center space-y-8 bg-card p-10 md:p-14 rounded-4xl border border-border-subtle shadow-xl relative overflow-hidden">
        {/* Decorative Background Blurs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Icon */}
          <div className="flex justify-center animate-bounce duration-3000">
            <div className="p-6 bg-accent/10 rounded-full ring-8 ring-accent/5">
              <BookDashed className="w-16 h-16 text-accent" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-3">
            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-linear-to-r from-accent to-accent/60 drop-shadow-sm">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-sm mx-auto">
              Oops! It looks like this page has been checked out, misplaced, or
              doesn't exist in our library's catalog.
            </p>
          </div>

          {/* Action Buttons Using Your New Component! */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="lg"
              icon={ArrowLeft}
            >
              Go Back
            </Button>

            <Button
              onClick={() => navigate("/")}
              variant="primary"
              size="lg"
              icon={Home}
              className="shadow-lg shadow-accent/20"
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
