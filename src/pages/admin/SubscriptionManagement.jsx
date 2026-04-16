import { useState, useEffect } from "react";
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
import { useToast } from "../../context/ToastContext";

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

  const fetchEverything = async () => {
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
    } catch (error) {
      toast.error("Failed to sync library data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEverything();
  }, []);

  const handleAddMonth = async (userId, months) => {
    try {
      await subscriptionService.createOrUpdate({
        userId: userId,
        numberofMonths: months,
      });
      toast.success(`Added ${months} month(s) to account`);
      fetchEverything();
    } catch (error) {
      toast.error("Failed to update subscription");
    }
  };

  const handleCancelSub = async () => {
    try {
      await subscriptionService.deleteByUserId(subToDelete.userId);
      toast.success("Subscription revoked");
      fetchEverything();
    } catch (error) {
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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-black tracking-tight">
          Member Subscriptions
        </h1>
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border border-border-subtle rounded-2xl text-sm focus:ring-4 focus:ring-accent/10 outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card border border-border-subtle rounded-3xl shadow-sm overflow-hidden">
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
                Add Credits
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
                  {/* User Info */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-black">
                        {item.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {item.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Status Pill */}
                  <td className="px-8 py-5 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-sm border ${
                        isActive
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-muted/10 text-muted-foreground border-border-subtle"
                      }`}
                    >
                      {isActive ? "Active Member" : "Standard User"}
                    </span>
                  </td>

                  {/* Countdown Logic */}
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
                          Ends:{" "}
                          {new Date(item.sub.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/30 font-bold">
                        —
                      </span>
                    )}
                  </td>

                  {/* Quick Control Buttons */}
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[10px] font-black py-1 h-8 rounded-lg border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                        onClick={() => handleAddMonth(item.id, 1)}
                      >
                        +1 Month
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[10px] font-black py-1 h-8 rounded-lg border-accent/30 text-accent hover:bg-accent hover:text-white"
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
                          className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                          title="Revoke All Access"
                        >
                          <ShieldAlert size={16} />
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
