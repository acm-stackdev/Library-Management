import { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  Search,
  Calendar,
  Clock,
  User,
  Plus,
  Minus,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

// Services
import { subscriptionService, adminService } from "../../services/apiservices";
import { useToast } from "../../context/useToast";

// UI Components
import Button from "../../components/ui/Button";
import LoadingState from "../../components/ui/LoadingState";
import ConfirmModal from "../../components/ui/ConfirmModal";

export default function SubscriptionManagement() {
  const [data, setData] = useState([]); // Combined users + sub info
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subToDelete, setSubToDelete] = useState(null);

  const toast = useToast();

  const fetchEverything = useCallback(async () => {
    try {
      setLoading(true);
      const [users, subs] = await Promise.all([
        adminService.getAllUsers(),
        subscriptionService.getAll(),
      ]);

      const combined = users
        .filter((user) => !user.roles?.includes("Admin"))
        .map((user) => {
          const sub = subs.find((s) => s.userId === user.id);
          return { ...user, sub };
        });

      setData(combined);
    } catch {
      toast.error("Failed to sync library data");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEverything();
  }, [fetchEverything]);

  const handleAddMonth = async (userId, months) => {
    try {
      await subscriptionService.createOrUpdate({
        userId: userId,
        numberofMonths: months,
      });
      toast.success(`Added ${months} month(s) to account`);
      fetchEverything();
    } catch {
      toast.error("Failed to update subscription");
    }
  };

  const handleCancelSub = async () => {
    try {
      await subscriptionService.deleteByUserId(subToDelete.userId);
      toast.success("Subscription revoked");
      fetchEverything();
    } catch {
      toast.error("Action failed");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Search Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
            <CreditCard className="text-accent w-8 h-8" />
            Subscriptions
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage member access levels and billing cycles.
          </p>
        </div>
        <div className="relative w-full lg:w-96 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-accent transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-card border border-border-subtle rounded-2xl text-sm focus:ring-4 focus:ring-accent/10 outline-hidden transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Main Table - Desktop View */}
      <div className="hidden md:block bg-card border border-border-subtle rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-muted/20 border-b border-border-subtle">
                <th className="px-8 py-5 font-black text-muted-foreground uppercase text-[10px] tracking-widest">
                  User Details
                </th>
                <th className="px-8 py-5 font-black text-muted-foreground uppercase text-[10px] tracking-widest text-center">
                  Status
                </th>
                <th className="px-8 py-5 font-black text-muted-foreground uppercase text-[10px] tracking-widest text-center">
                  Time Remaining
                </th>
                <th className="px-8 py-5 font-black text-muted-foreground uppercase text-[10px] tracking-widest text-right">
                  Manage Access
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredData.map((item) => {
                const daysLeft = item.sub
                  ? Math.max(
                      0,
                      Math.ceil(
                        (new Date(item.sub.endDate) - new Date()) /
                          (1000 * 60 * 60 * 24),
                      ),
                    )
                  : 0;
                const isActive = item.sub?.isActive && daysLeft > 0;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/5 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-black shadow-xs">
                          {item.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground group-hover:text-accent transition-colors">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {item.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-5 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-muted/10 text-muted-foreground border-border-subtle"
                        }`}
                      >
                        {isActive ? "Active Member" : "Standard User"}
                      </span>
                    </td>

                    <td className="px-8 py-5 text-center">
                      {isActive ? (
                        <div className="flex flex-col items-center">
                          <span
                            className={`text-sm font-black flex items-center gap-1.5 ${daysLeft < 7 ? "text-red-500 animate-pulse" : "text-foreground"}`}
                          >
                            <Clock size={14} />
                            {daysLeft} Days
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Ends: {new Date(item.sub.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/30 font-bold tracking-widest">
                          INACTIVE
                        </span>
                      )}
                    </td>

                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[10px] font-black py-1 h-8 rounded-lg border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-xs"
                          onClick={() => handleAddMonth(item.id, 1)}
                        >
                          +1 Month
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[10px] font-black py-1 h-8 rounded-lg border-accent/30 text-accent hover:bg-accent hover:text-white transition-all shadow-xs"
                          onClick={() => handleAddMonth(item.id, 12)}
                        >
                          +1 Year
                        </Button>

                        {isActive && (
                          <button
                            onClick={() => {
                              setSubToDelete(item.sub);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 ml-1 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Revoke All Access"
                          >
                            <ShieldAlert size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card Layout - Mobile View */}
      <div className="md:hidden space-y-4">
        {filteredData.map((item) => {
          const daysLeft = item.sub
            ? Math.max(
                0,
                Math.ceil(
                  (new Date(item.sub.endDate) - new Date()) /
                    (1000 * 60 * 60 * 24),
                ),
              )
            : 0;
          const isActive = item.sub?.isActive && daysLeft > 0;

          return (
            <div
              key={item.id}
              className="bg-card border border-border-subtle rounded-2xl p-5 shadow-sm space-y-5"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-black">
                    {item.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-foreground text-sm truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate">
                      {item.email}
                    </span>
                  </div>
                </div>
                <span
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-muted/10 text-muted-foreground border-border-subtle"
                  }`}
                >
                  {isActive ? "Member" : "Standard"}
                </span>
              </div>

              {isActive && (
                <div className="bg-muted/10 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                      Remaining Time
                    </span>
                    <span
                      className={`text-sm font-black flex items-center gap-1.5 ${daysLeft < 7 ? "text-red-500 animate-pulse" : "text-foreground"}`}
                    >
                      <Clock size={13} />
                      {daysLeft} Days
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                      Expires On
                    </span>
                    <p className="text-xs font-bold text-foreground">
                      {new Date(item.sub.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-border-subtle/50">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block mb-3 text-center">
                  Quick Actions
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-[11px] font-black py-2.5 rounded-xl border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                    onClick={() => handleAddMonth(item.id, 1)}
                    icon={Plus}
                  >
                    1 Month
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-[11px] font-black py-2.5 rounded-xl border-accent/30 text-accent hover:bg-accent hover:text-white"
                    onClick={() => handleAddMonth(item.id, 12)}
                    icon={Sparkles}
                  >
                    1 Year
                  </Button>
                  {isActive && (
                    <Button
                      variant="ghost"
                      className="text-red-500 hover:bg-red-500/10 rounded-xl p-2.5"
                      onClick={() => {
                        setSubToDelete(item.sub);
                        setIsDeleteModalOpen(true);
                      }}
                      icon={ShieldAlert}
                    >
                      <span className="sm:hidden ml-1">Revoke</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleCancelSub}
        title="Revoke Membership"
        message="This will immediately strip the user of all credits and reset their role. Are you sure?"
      />
    </div>
  );
}

