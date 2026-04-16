import { Check, Circle } from "lucide-react";

export default function AuthRequirements({ requirements, isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="mt-2 space-y-1.5 px-1 animate-in slide-in-from-top-2 fade-in duration-300">
      {requirements.map((req, i) => (
        <div
          key={i}
          className={`flex items-center gap-2 text-[11px] font-bold transition-all duration-300 ${
            req.met
              ? "text-green-500/50" // Mute it when done to declutter
              : "text-muted-foreground" // Keep it clear when missing
          }`}
        >
          {req.met ? (
            <Check size={12} strokeWidth={3} className="shrink-0" />
          ) : (
            <Circle size={10} strokeWidth={3} className="shrink-0 opacity-20" />
          )}
          <span>{req.label}</span>
        </div>
      ))}
    </div>
  );
}
