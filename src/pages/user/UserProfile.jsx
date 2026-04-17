import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  CreditCard,
  Clock,
  BookMarked,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Heart,
  RotateCcw,
} from "lucide-react";

import {
  subscriptionService,
  wishlistService,
  borrowService,
} from "../../services/apiservices";
import { useAuth } from "../../context/useAuth";
import { useToast } from "../../context/ToastContext";
import LoadingState from "../../components/ui/LoadingState";
import Button from "../../components/ui/Button";

export default function UserProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [data, setData] = useState({
    subscription: null,
    wishlist: [],
    loans: [],
    loading: true,
  });

  const fetchMemberData = async () => {
    try {
      const [sub, wishlist, loans] = await Promise.all([
        subscriptionService.getMySubscription().catch(() => null),
        wishlistService.getAll(),
        borrowService.getMyHistory(),
      ]);

      setData({
        subscription: sub,
        wishlist: wishlist,
        loans: loans,
        loading: false,
      });
    } catch (error) {
      toast.error("Failed to sync profile");
      setData((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchMemberData();
  }, []);

  const handleReturn = async (loanId, title) => {
    try {
      await borrowService.returnBook(loanId);
      toast.success(`"${title}" returned successfully!`);
      fetchMemberData(); // Refresh the list
    } catch (err) {
      toast.error(err.response?.data?.message || "Return failed");
    }
  };

  if (data.loading) return <LoadingState />;

  const daysLeft = data.subscription
    ? Math.max(
        0,
        Math.ceil(
          (new Date(data.subscription.endDate) - new Date()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;
  const isSubscriber = data.subscription?.isActive && daysLeft > 0;

  return (
    <div className="max-w-5xl space-y-8 pb-10">
      {/* ── 1. Header ── */}
      <section className="bg-card border border-border-subtle rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-accent/20 relative z-10">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-center md:text-left relative z-10">
          <h1 className="text-2xl font-black tracking-tight">{user?.name}</h1>
          <span className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">
            <Shield size={14} className="text-accent" />{" "}
            {user?.roles?.join(" • ")}
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── 2. Subscription Snapshot ── */}
        <div className="space-y-6">
          <div
            className={`p-6 rounded-3xl border ${isSubscriber ? "bg-accent/3 border-accent/20" : "bg-muted/10 border-border-subtle"}`}
          >
            <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-4">
              <CreditCard size={16} /> Membership
            </h3>
            {isSubscriber ? (
              <div className="space-y-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-foreground">
                    {daysLeft}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground uppercase">
                    Days
                  </span>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-accent h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (daysLeft / 30) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs font-bold text-muted-foreground italic">
                No active subscription
              </p>
            )}
          </div>

          <div className="bg-card border border-border-subtle rounded-3xl p-6 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-xl font-black">
                {data.loans.filter((l) => !l.returnDate).length}
              </p>
              <p className="text-[10px] font-black text-muted-foreground uppercase">
                Active Loans
              </p>
            </div>
            <div>
              <p className="text-xl font-black">{data.wishlist.length}</p>
              <p className="text-[10px] font-black text-muted-foreground uppercase">
                Wishlist
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. Recent Wishlist & Returns ── */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg flex items-center gap-2">
                <Heart size={18} className="text-red-500 fill-red-500" />{" "}
                Wishlist
              </h3>
              <button
                onClick={() => navigate("/profile/wishlist")}
                className="text-[10px] font-black uppercase text-accent hover:underline flex items-center gap-1"
              >
                View All <ArrowRight size={12} />
              </button>
            </div>
            <div className="space-y-2">
              {data.wishlist.slice(0, 5).map((item) => (
                <div
                  key={item.wishlistId}
                  className="flex items-center justify-between p-4 bg-card border border-border-subtle rounded-2xl hover:border-accent/30 transition-all"
                >
                  <div>
                    <p className="font-bold text-sm">{item.bookTitle}</p>
                    <p className="text-[10px] text-muted-foreground italic">
                      Saved on {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <BookMarked size={16} className="text-muted-foreground/30" />
                </div>
              ))}
            </div>
          </section>

          {/* Recent Loans with RETURN Action */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg flex items-center gap-2">
                <Clock size={18} className="text-accent" /> Active Loans
              </h3>
              <button
                onClick={() => navigate("/profile/loans")}
                className="text-[10px] font-black uppercase text-accent hover:underline flex items-center gap-1"
              >
                Loan History <ArrowRight size={12} />
              </button>
            </div>
            <div className="bg-card border border-border-subtle rounded-3xl divide-y divide-border-subtle overflow-hidden">
              {data.loans
                .filter((l) => !l.returnDate)
                .slice(0, 5)
                .map((loan) => (
                  <div
                    key={loan.borrowRecordId}
                    className="px-6 py-4 flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-bold text-sm">{loan.bookTitle}</p>
                      <p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">
                        Due: {new Date(loan.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      icon={RotateCcw}
                      className="h-8 text-[10px] font-black rounded-lg border-accent/20 text-accent hover:bg-accent hover:text-white"
                      onClick={() =>
                        handleReturn(loan.borrowRecordId, loan.bookTitle)
                      }
                    >
                      Return
                    </Button>
                  </div>
                ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
