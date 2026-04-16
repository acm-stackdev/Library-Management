export default function BookDescription({
  description,
  isEditing,
  editData,
  handleChange,
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
        <span className="w-1.5 h-6 bg-accent rounded-full" />
        About this Book
      </h3>
      {isEditing ? (
        <textarea
          name="description"
          value={editData.description}
          onChange={handleChange}
          placeholder="Enter book description..."
          className="w-full h-32 bg-card text-muted leading-relaxed text-lg border border-border-subtle rounded-xl p-4 outline-hidden focus:ring-2 focus:ring-accent/50 resize-none"
        />
      ) : (
        <p className="text-muted leading-relaxed text-lg">
          {description || "No detailed description available for this book."}
        </p>
      )}
    </div>
  );
}
