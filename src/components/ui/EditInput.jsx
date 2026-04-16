export default function EditInput({
  label,
  icon: Icon,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-[10px] text-muted uppercase font-bold tracking-wider">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-card text-sm font-semibold text-foreground border border-border-subtle rounded-lg px-3 py-1.5 outline-hidden focus:ring-2 focus:ring-accent/50"
      />
    </div>
  );
}
