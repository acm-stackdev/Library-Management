import { useState, useEffect, useCallback, useMemo } from "react";
import { booksService } from "../services/apiservices";
import BookCard from "../components/books/BookCard";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import SearchBar from "../components/ui/SearchBar";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await booksService.getAll();
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError(
        "Failed to load the book catalog. Please check your connection.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
    window.addEventListener("bookCreated", fetchBooks);
    return () => {
      window.removeEventListener("bookCreated", fetchBooks);
    };
  }, []);

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;

    const query = searchQuery.toLowerCase();
    return books.filter(
      (book) =>
        book.title?.toLowerCase().includes(query) ||
        book.authorNames?.some((author) =>
          author.toLowerCase().includes(query),
        ) ||
        book.isbn?.includes(query),
    );
  }, [books, searchQuery]);

  const categories = useMemo(() => {
    return filteredBooks.reduce((acc, book) => {
      const category = book.categoryName || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(book);
      return acc;
    }, {});
  }, [filteredBooks]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onBack={fetchBooks} />;

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500">
      <section className="relative overflow-hidden mb-12 rounded-4xl bg-card border border-border-subtle shadow-sm">
        <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        {/* Reduced padding from py-28 to py-12 */}
        <div className="relative px-6 py-12 md:py-16 text-center flex flex-col items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Discover your next{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent/60">
              great read.
            </span>
          </h1>
          <div className="w-full max-w-xl mt-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery("")}
              placeholder="Search for books, authors, or ISBN..."
            />
          </div>
        </div>
      </section>

      {/* ── Category Grid ── */}
      <div className="space-y-16">
        {Object.entries(categories).map(([category, categoryBooks]) => (
          <div key={category}>
            {/* Sleek Header with Line Separator */}
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground whitespace-nowrap">
                {category}
              </h2>
              <div className="h-px bg-border-subtle flex-1 mt-1" />
              <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border-subtle/50">
                {categoryBooks.length}{" "}
                {categoryBooks.length === 1 ? "Item" : "Items"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {categoryBooks.map((book) => (
                <BookCard key={book.bookId || book.id} book={book} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
