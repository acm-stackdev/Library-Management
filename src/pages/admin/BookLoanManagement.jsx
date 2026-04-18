import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeftRight,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  RotateCcw,
  User,
} from "lucide-react";

// Services
import { borrowService } from "../../services/apiservices";
import { useToast } from "../../context/useToast";

// UI Components
import Button from "../../components/ui/Button";
import LoadingState from "../../components/ui/LoadingState";
import ConfirmModal from "../../components/ui/ConfirmModal";

export default function BookLoanManagement() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Return Logic State
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const toast = useToast();

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const data = await borrowService.adminGetAll();
      setRecords(data);
    } catch {
      toast.error("Failed to load lending records");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleReturn = async () => {
    try {
      await borrowService.returnBook(selectedRecord.borrowRecordId);
      toast.success(`"${selectedRecord.bookTitle}" has been returned`);
      fetchRecords();
    } catch {
      toast.error("Process failed: Could not mark as returned");
    } finally {
      setIsReturnModalOpen(false);
    }
  };

  const getStatus = (record) => {
    if (record.returnDate)
      return {
        label: "Returned",
        color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        icon: CheckCircle2,
      };

    const isOverdue = new Date(record.dueDate) < new Date();
    if (isOverdue)
      return {
        label: "Overdue",
        color: "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse",
        icon: AlertCircle,
      };

    return {
      label: "Active Loan",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      icon: Clock,
    };
  };

  const filteredRecords = records.filter(
    (r) =>
      r.bookTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.userName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
            <ArrowLeftRight className="text-accent w-8 h-8" />
            Book Loans
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track and manage active book borrowings.
          </p>
        </div>
        <div className="relative w-full lg:w-96 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-accent transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search member or book title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-card border border-border-subtle rounded-2xl text-sm focus:ring-4 focus:ring-accent/10 outline-hidden transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Loan Records - Desktop Table */}
      <div className="hidden md:block bg-card border border-border-subtle rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-muted/20 border-b border-border-subtle text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                <th className="px-6 py-5">Book Details</th>
                <th className="px-6 py-5">Borrowed By</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Dates</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => {
                  const status = getStatus(record);
                  const StatusIcon = status.icon;
                  return (
                    <tr
                      key={record.borrowRecordId}
                      className="hover:bg-muted/5 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col max-w-xs">
                          <span className="font-bold text-foreground text-sm tracking-tight truncate group-hover:text-accent transition-colors">
                            {record.bookTitle}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            REF: {record.bookId}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 shrink-0 rounded-full bg-linear-to-br from-accent to-accent/60 flex items-center justify-center text-white font-black shadow-sm text-xs">
                            {record.userName?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-foreground">
                            {record.userName}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${status.color}`}
                        >
                          <StatusIcon size={12} />
                          {status.label}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5 text-foreground font-bold text-xs">
                            <Calendar size={12} className="text-muted-foreground" />
                            Due: {new Date(record.dueDate).toLocaleDateString()}
                          </div>
                          <span className="text-[10px] text-muted-foreground pl-4.5">
                            Borrowed: {new Date(record.borrowDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-right">
                        {!record.returnDate ? (
                          <Button
                            size="sm"
                            variant="primary"
                            icon={RotateCcw}
                            className="rounded-xl font-bold text-xs px-4 h-9 shadow-sm hover:shadow-md"
                            onClick={() => {
                              setSelectedRecord(record);
                              setIsReturnModalOpen(true);
                            }}
                          >
                            Return Book
                          </Button>
                        ) : (
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">
                              Received
                            </span>
                            <span className="text-xs font-bold text-foreground">
                              {new Date(record.returnDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-8 py-24 text-center text-muted-foreground italic"
                  >
                    No borrowing records found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Loan Records - Mobile/Tablet Cards */}
      <div className="md:hidden space-y-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => {
            const status = getStatus(record);
            const StatusIcon = status.icon;
            return (
              <div
                key={record.borrowRecordId}
                className="bg-card border border-border-subtle rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">
                      Book Title
                    </span>
                    <h3 className="font-bold text-foreground text-base tracking-tight leading-tight">
                      {record.bookTitle}
                    </h3>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${status.color}`}
                  >
                    <StatusIcon size={12} />
                    {status.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border-subtle/50">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                      Member
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-[10px]">
                        {record.userName?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold truncate">
                        {record.userName}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                      Due Date
                    </span>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                      <Calendar size={14} className="text-muted-foreground" />
                      {new Date(record.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  {!record.returnDate ? (
                    <Button
                      variant="primary"
                      icon={RotateCcw}
                      className="w-full rounded-xl font-bold py-3 shadow-xs"
                      onClick={() => {
                        setSelectedRecord(record);
                        setIsReturnModalOpen(true);
                      }}
                    >
                      Return This Book
                    </Button>
                  ) : (
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">
                        Returned On
                      </span>
                      <span className="text-sm font-bold text-emerald-600">
                        {new Date(record.returnDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-card border border-border-subtle rounded-3xl p-12 text-center text-muted-foreground italic">
            No borrowing records found.
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        onConfirm={handleReturn}
        title="Confirm Book Return"
        message={`Are you sure you want to mark "${selectedRecord?.bookTitle}" as returned? This copies the book back into available stock.`}
      />
    </div>
  );
}
