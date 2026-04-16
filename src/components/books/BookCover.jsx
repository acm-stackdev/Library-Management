import { BookOpen, Heart } from "lucide-react";

export default function BookCover({
  coverUrl,
  title,
  user,
  isEditing,
  isLiked,
  onToggleLike,
  isLoading,
}) {
  return (
    <div className="w-full md:w-64 shrink-0 space-y-4">
      <div className="relative group">
        <div className="aspect-3/4 rounded-2xl overflow-hidden shadow-xl bg-muted/20 border border-border-subtle">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/600x800?text=No+Cover+Available";
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4 bg-accent/5">
              <BookOpen className="w-12 h-12 text-accent/30" />
              <span className="text-muted text-xs font-medium">
                No Cover Preview
              </span>
            </div>
          )}
        </div>

        {/* Heart / Like Button */}
        {user && !isEditing && (
          <button
            type="button"
            onClick={onToggleLike}
            disabled={isLoading}
            className={`absolute top-4 right-4 p-2.5 rounded-xl backdrop-blur-md shadow-lg transition-all 
              ${isLoading ? "opacity-50 cursor-wait" : "hover:scale-110"} 
              ${
                isLiked
                  ? "bg-red-500 text-white"
                  : "bg-card/80 text-foreground hover:bg-card"
              }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </button>
        )}
      </div>
    </div>
  );
}
