import { Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function BookCard({ book }) {
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();

  const coverUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`
    : book.coverImage;

  return (
    <div className="bg-card rounded-2xl shadow-md border border-border-subtle hover:shadow-xl transition-all transform hover:-translate-y-1 group relative">
      <Link to={`/book/${book.bookId}`} className="block p-4">
        <div className="aspect-3/4 bg-muted/10 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/300x400?text=No+Cover";
              }}
            />
          ) : (
            <span className="text-muted text-4xl">📚</span>
          )}
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
            {book.categoryName || "General"}
          </span>
          <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
            {book.title}
          </h3>
          <p className="text-muted text-xs font-medium line-clamp-1">
            {book.authorNames?.join(", ") || book.author}
          </p>
        </div>

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-border-subtle">
          <span className="text-xs font-bold text-muted">
            {book.publishedYear}
          </span>
          <span className="text-accent text-xs font-bold group-hover:underline underline-offset-4 decoration-2">
            Details →
          </span>
        </div>
      </Link>

      {user && (
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className={`absolute top-6 right-6 p-2 rounded-xl backdrop-blur-md transition-all shadow-lg z-10 ${
            isLiked
              ? "bg-red-500 text-white"
              : "bg-black/20 text-white hover:bg-black/40"
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        </button>
      )}
    </div>
  );
}
