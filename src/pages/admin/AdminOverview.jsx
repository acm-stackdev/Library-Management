import { useState, useEffect } from "react";
import { Users, BookOpen, ArrowUpRight, Star, Sparkles } from "lucide-react";
import {
  adminService,
  booksService,
  subscriptionService,
  borrowService,
} from "../../services/apiservices";
import LoadingState from "../../components/ui/LoadingState";
import { useToast } from "../../context/useToast";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    activeBorrows: 0,
    totalSubscribers: 0,
  });
  const [topWishlisted, setTopWishlisted] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [users, books, wishlistSummary, subscriptions, allBorrows] =
          await Promise.all([
            adminService.getAllUsers(),
            booksService.getAll(),
            adminService.getWishlistSummary(),
            subscriptionService.getAll(),
            borrowService.adminGetAll(),
          ]);

        const activeCount = allBorrows.filter(
          (record) => record.returnDate === null,
        ).length;

        setStats((prev) => ({
          ...prev,
          totalUsers: users.length,
          totalBooks: books.length,
          totalSubscribers: subscriptions.length,
          activeBorrows: activeCount,
        }));

        setTopWishlisted(wishlistSummary.slice(0, 5));
      } catch (error) {
        console.error("Dashboard Sync Error:", error);
        toast.error("Failed to load live statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time library insights.
        </p>
      </div>

      {/* ── Updated Grid to 4 Columns ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-card border border-border-subtle rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 text-blue-500 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Total Users
            </p>
            <h3 className="text-3xl font-black text-foreground">
              {stats.totalUsers}
            </h3>
          </div>
        </div>

        {/* Total Books */}
        <div className="bg-card border border-border-subtle rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Total Books
            </p>
            <h3 className="text-3xl font-black text-foreground">
              {stats.totalBooks}
            </h3>
          </div>
        </div>

        {/* Total Subscribers */}
        <div className="bg-card border border-border-subtle rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-amber-500/10 text-amber-500 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Subscribers
            </p>
            <h3 className="text-3xl font-black text-foreground">
              {stats.totalSubscribers}
            </h3>
          </div>
        </div>

        {/* Active Borrows */}
        <div className="bg-card border border-border-subtle rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 text-purple-500 rounded-xl">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Active Borrows
            </p>
            <h3 className="text-3xl font-black text-foreground">
              {stats.activeBorrows}
            </h3>
          </div>
        </div>
      </div>

      {/* Wishlist Section */}
      <div className="bg-card border border-border-subtle rounded-3xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <h2 className="font-bold text-lg">Most Wishlisted Books</h2>
          </div>
          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            Top 5 Trending
          </span>
        </div>

        <div className="p-0">
          {topWishlisted.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-sm italic">
              No wishlist activity recorded yet.
            </div>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {topWishlisted.map((item, index) => (
                <li
                  key={item.bookId}
                  className="flex items-center justify-between p-5 sm:px-8 hover:bg-muted/5 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className="text-2xl font-black text-muted-foreground/20 italic w-6">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-foreground tracking-tight">
                        {item.bookTitle}
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground uppercase">
                        Ref: {item.bookId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-accent/10 text-accent px-3 py-1.5 rounded-xl text-xs font-black uppercase">
                    <Star className="w-3 h-3 fill-current" />
                    {item.wishlistCount}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
