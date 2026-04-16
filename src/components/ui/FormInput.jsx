import { Eye, EyeOff } from "lucide-react";

export default function FormInput({
  icon: Icon,
  togglePassword,
  isPassword,
  textarea,
  ...props
}) {
  const Component = textarea ? "textarea" : "input";

  const baseClasses = `
    w-full 
    ${Icon ? "pl-12" : "px-4"} 
    py-3.5 
    rounded-xl 
    bg-muted/20 
    border border-border-subtle 
    text-foreground text-lg 
    placeholder:text-muted-foreground/40 
    outline-hidden
    transition-all duration-200
    focus:bg-background
    focus:border-accent
    focus:ring-4 focus:ring-accent/10
    ${textarea ? "min-h-[120px] resize-none" : ""}
    ${props.className || ""}
  `;

  return (
    <div className="relative group w-full">
      {Icon && (
        <div
          className={`absolute left-4 ${textarea ? "top-5" : "top-1/2 -translate-y-1/2"} text-muted-foreground/50 group-focus-within:text-accent transition-colors z-10`}
        >
          <Icon size={20} strokeWidth={2.5} />
        </div>
      )}

      <Component {...props} className={baseClasses} />

      {isPassword && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors z-10"
        >
          {props.type === "password" ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      )}
    </div>
  );
}
