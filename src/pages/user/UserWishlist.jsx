import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2, ArrowRight, Search, BookMarked } from "lucide-react";
import { wishlistService } from "../../services/apiservices";
import { useToast } from "../../context/useToast";
import LoadingState from "../../components/ui/LoadingState";

export default function UserWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const data = await wishlistService.getAll();
      setWishlist(data);
    } catch {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (e, wishlistId) => {
    e.stopPropagation(); // Prevent navigating to book details
    try {
      await wishlistService.delete(wishlistId);
      toast.success("Removed from wishlist");
      setWishlist((prev) =>
        prev.filter((item) => item.wishlistId !== wishlistId),
      );
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const filtered = wishlist.filter((item) =>
    item.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="relative w-full max-w-md">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40"
          size={18}
        />
        <input
          type="text"
          placeholder="Search wishlist..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-card border border-border-subtle rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.wishlistId}
              onClick={() => navigate(`/books/${item.bookId}`)}
              className="group flex items-center justify-between p-5 bg-card border border-border-subtle rounded-3xl hover:border-accent/40 transition-all cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-2xl text-muted-foreground/40 group-hover:text-accent group-hover:bg-accent/10 transition-colors">
                  <BookMarked size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground tracking-tight">
                    {item.bookTitle}
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5">
                    Saved: {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleRemove(e, item.wishlistId)}
                  className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
                <div className="p-3 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all">
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-muted/5 border border-dashed border-border-subtle rounded-3xl">
            <Heart
              size={40}
              className="mx-auto text-muted-foreground/20 mb-3"
            />
            <p className="text-muted-foreground font-medium">
              No books saved to your wishlist yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
