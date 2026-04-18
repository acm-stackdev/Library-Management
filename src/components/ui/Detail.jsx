export default function Detail({ label, value }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-[10px] text-muted uppercase font-bold tracking-wider">
        {label}
      </div>
      <p
        className="text-sm font-semibold text-foreground truncate"
        title={value}
      >
        {value}
      </p>
    </div>
  );
}
