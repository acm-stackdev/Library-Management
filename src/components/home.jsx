import { useState, useEffect } from "react";
import { booksService } from "../services/apiservices";
import BookCard from "./BookCard";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await booksService.getAll();
        setBooks(data);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Group books by category
  const categories = books.reduce((acc, book) => {
    const category = book.categoryName || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(book);
    return acc;
  }, {});

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );

  return (
    <main className="p-6 max-w-7xl mx-auto min-h-screen">
      <section className="mb-12 text-center py-10 bg-accent/10 rounded-3xl">
        <h2 className="text-4xl font-extrabold mb-4 text-foreground">
          Discover Your Next Read
        </h2>
        <p className="text-muted max-w-xl mx-auto">
          Explore our extensive collection of books across various genres and
          start your reading journey today.
        </p>
      </section>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {Object.entries(categories).map(([category, categoryBooks]) => (
        <div key={category} className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-foreground border-l-4 border-accent pl-4">
              {category}
            </h3>
            <button className="text-accent font-semibold hover:underline">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryBooks.map((book) => (
              <BookCard key={book.bookId} book={book} />
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
