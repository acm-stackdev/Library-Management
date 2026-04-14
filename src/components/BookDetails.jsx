import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { booksService } from "../services/apiservices";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Layers,
  Hash,
  User,
  Calendar,
  Trash2,
  Edit,
  Heart,
  Bookmark,
} from "lucide-react";
import Button from "./Button";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();

  const isAdmin = user?.roles?.includes("Admin");

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const data = await booksService.getById(id);
        setBook(data);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Could not find the book you're looking for.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        <p className="text-muted font-medium animate-pulse">
          Loading book details...
        </p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center px-4">
        <div className="bg-red-500/10 p-6 rounded-full">
          <Bookmark className="w-12 h-12 text-red-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Oops! Book Not Found
          </h2>
          <p className="text-muted max-w-md">{error}</p>
        </div>
        <Button
          onClick={() => navigate("/")}
          variant="primary"
          className="rounded-xl px-8"
        >
          Back to Library
        </Button>
      </div>
    );
  }

  const coverUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`
    : null;

  const coverColor = book.coverColor || "var(--accent-main)";

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-500">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="bg-card rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
        {/* Header band */}
        <div
          className="h-40 flex items-end p-8"
          style={{ backgroundColor: coverColor }}
        >
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-white/70">
              {book.categoryName}
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-1 text-white tracking-tight">
              {book.title}
            </h2>
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Left Column: Book Cover */}
            <div className="w-full md:w-64 shrink-0 space-y-4">
              <div className="relative group">
                <div className="aspect-3/4 rounded-2xl overflow-hidden shadow-xl bg-muted/20 border border-border-subtle">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={book.title}
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
                {user && (
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`absolute top-4 right-4 p-2.5 rounded-xl backdrop-blur-md shadow-lg transition-all ${
                      isLiked
                        ? "bg-red-500 text-white"
                        : "bg-card/80 text-foreground hover:bg-card"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Info */}
            <div className="flex-1 space-y-8 my-auto">
              <div className="flex flex-wrap gap-3">
                <span className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  book.available !== false ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                }`}>
                  {book.available !== false ? "Available" : "Checked Out"}
                </span>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-accent rounded-full"></span>
                  About this Book
                </h3>
                <p className="text-muted leading-relaxed text-lg">
                  {book.description ||
                    "No detailed description available for this book. Check back later for updates."}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-muted/5 rounded-2xl border border-border-subtle/50">
                <Detail
                  icon={User}
                  label="Author"
                  value={book.authorNames?.join(", ") || "Unknown Author"}
                />
                <Detail icon={Hash} label="ISBN" value={book.isbn || "N/A"} />
                <Detail
                  icon={Calendar}
                  label="Published"
                  value={String(book.publishedYear || "Unknown")}
                />
                <Detail
                  icon={Layers}
                  label="Pages"
                  value={String(book.totalPages || "N/A")}
                />
              </div>

              {isAdmin && (
                <div className="flex flex-wrap gap-3 pt-4 border-t border-border-subtle">
                  <Button
                    className="gap-2 px-8 rounded-xl font-bold"
                    onClick={() => console.log("Edit mode")}
                  >
                    <Edit className="h-4 w-4" /> Edit Book
                  </Button>
                  <Button
                    variant="danger"
                    className="gap-2 px-8 rounded-xl font-bold"
                    onClick={() => console.log("Delete")}
                  >
                    <Trash2 className="h-4 w-4" /> Delete Book
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }) {
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
