import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function BookCard({ book, isLiked }) {
  const { user } = useAuth();

  const coverUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`
    : book.coverImage;

  return (
    <div className="bg-card rounded-2xl shadow-md border border-border-subtle hover:shadow-xl transition-all transform hover:-translate-y-1 group relative overflow-hidden">
      <Link to={`/book/${book.bookId}`} className="block">
        <div className="aspect-3/4 bg-muted/10 flex items-center justify-center relative">
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

          {/* Permanent Transparent Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-5 bg-linear-to-t from-black/95 via-black/50 to-transparent pt-12">
            <h3 className="text-white text-lg font-bold line-clamp-2 leading-tight">
              {book.title}
            </h3>
            <p className="text-white/70 text-xs mt-1 line-clamp-1">
              {book.authorNames?.join(", ") || book.author}
            </p>
          </div>
        </div>
      </Link>

      {user && (
        <div
          className={`absolute top-4 right-4 p-2 rounded-xl backdrop-blur-md transition-all shadow-lg z-10 ${
            isLiked ? "bg-red-500 text-white" : "bg-black/40 text-white"
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        </div>
      )}
    </div>
  );
}
