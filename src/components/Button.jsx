const variants = {
  primary: "bg-accent text-white hover:bg-accent/90 shadow-md hover:shadow-lg",
  secondary: "bg-muted/10 text-foreground hover:bg-muted/20",
  outline: "border border-border-subtle text-foreground hover:bg-muted/5",
  danger: "text-red-500 hover:bg-red-500/10",
  ghost: "text-muted hover:text-foreground hover:bg-muted/10",
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
}) {
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
      {Icon && <Icon size={size === "sm" ? 16 : size === "lg" ? 20 : 18} />}
      {children}
    </button>
  );
}
