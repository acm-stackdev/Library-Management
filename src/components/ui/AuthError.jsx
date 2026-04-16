export default function AuthError({ message }) {
  if (!message) return null;
  return (
    <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20 animate-in fade-in zoom-in-95 duration-200">
      {message}
    </div>
  );
}
