export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent" />
      <p className="text-muted font-medium animate-pulse">
        Loading book details…
      </p>
    </div>
  );
}
