export default function FormSelect({ icon: Icon, options, ...props }) {
  return (
    <div className="relative group w-full">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-accent transition-colors z-10 pointer-events-none">
          <Icon size={20} strokeWidth={2.5} />
        </div>
      )}
      <select
        {...props}
        className={`
          w-full ${Icon ? "pl-12" : "px-4"} py-3.5 
          rounded-xl bg-muted/20 border border-border-subtle 
          text-foreground text-lg outline-hidden appearance-none
          transition-all duration-200 focus:bg-background focus:border-accent focus:ring-4 focus:ring-accent/10
          ${props.className || ""}
        `}
      >
        <option value="" disabled>
          {props.placeholder || "Select an option"}
        </option>
        {options.map((opt, index) => (
          <option
            key={opt.id || index}
            value={opt.id}
            className="bg-card text-foreground"
          >
            {opt.name}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/50">
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 1L6 6L11 1" />
        </svg>
      </div>
    </div>
  );
}
