export default function BookCard({ book }) {
  const coverUrl = book.isbn 
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`
    : book.coverImage;

  return (
    <div className="bg-card p-4 rounded-xl shadow-md border border-border-subtle hover:shadow-lg transition-all transform hover:-translate-y-1">
      <div className="aspect-3/4 bg-muted/10 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/300x400?text=No+Cover";
            }}
          />
        ) : (
          <span className="text-muted text-4xl">📚</span>
        )}
      </div>
      <h3 className="text-lg font-semibold mb-1 text-foreground line-clamp-1">
        {book.title}
      </h3>
      <p className="text-muted text-sm mb-2">
        {book.authorNames ? book.authorNames.join(", ") : book.author}
      </p>
      <div className="flex justify-end items-center mt-4">
        <button className="text-accent text-sm font-semibold hover:underline">
          View Details
        </button>
      </div>
    </div>
  );
}
