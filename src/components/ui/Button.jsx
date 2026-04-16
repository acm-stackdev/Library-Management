const variants = {
  primary: "bg-accent text-white hover:opacity-90 shadow-sm",
  solid: "bg-foreground text-background hover:opacity-90 shadow-sm",
  secondary:
    "bg-muted text-muted-foreground hover:bg-muted/80 border border-border-subtle/50",
  outline: "border border-border-subtle text-foreground hover:bg-muted/50",
  danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  icon: Icon,
  iconSize,
}) {
  const getIconSize = () => {
    if (iconSize) return iconSize;
    if (size === "sm") return 18;
    if (size === "lg") return 26;
    return 22;
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 
        font-semibold rounded-lg transition-all duration-200 
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `}
    >
      {Icon && (
        <Icon size={getIconSize()} strokeWidth={2.5} className="shrink-0" />
      )}
      {children}
    </button>
  );
}
