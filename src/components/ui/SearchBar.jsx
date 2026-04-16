import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  className = "",
}) {
  return (
    <div className={`relative group ${className}`}>
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-muted/30 border border-border-subtle text-foreground rounded-2xl py-4 pl-12 pr-12 outline-hidden focus:bg-card focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all shadow-sm"
      />

      {/* Clear Button (Only shows if there is text) */}
      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          title="Clear search"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
