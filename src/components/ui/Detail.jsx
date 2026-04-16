export default function Detail({ icon: Icon, label, value }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-[10px] text-muted uppercase font-bold tracking-wider">
        <Icon className="h-3 w-3" /> {label}
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
