import { useState, useEffect } from "react";
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
import { useToast } from "../../context/ToastContext";

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

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await borrowService.adminGetAll();
      setRecords(data);
    } catch (error) {
      toast.error("Failed to load lending records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleReturn = async () => {
    try {
      await borrowService.returnBook(selectedRecord.borrowRecordId);
      toast.success(`"${selectedRecord.bookTitle}" has been returned`);
      fetchRecords();
    } catch (error) {
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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <ArrowLeftRight className="text-accent" />
            Book Loan Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Track and manage active book borrowings.
          </p>
        </div>
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40"
            size={18}
          />
          <input
            type="text"
            placeholder="Search member or book title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border border-border-subtle rounded-2xl text-sm focus:ring-4 focus:ring-accent/10 outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Loan Table */}
      <div className="bg-card border border-border-subtle rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-muted/20 border-b border-border-subtle text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                <th className="px-8 py-5">Book Details</th>
                <th className="px-8 py-5">Borrowed By</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Due Date</th>
                <th className="px-8 py-5 text-right">Actions</th>
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
                      className="hover:bg-muted/5 transition-colors"
                    >
                      {/* Book Info */}
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground text-base tracking-tight">
                            {record.bookTitle}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            ID: {record.bookId}
                          </span>
                        </div>
                      </td>

                      {/* User Info */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-accent to-accent/60 flex items-center justify-center text-white font-black shadow-inner">
                            {record.userName?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{record.userName}</span>
                        </div>
                      </td>

                      {/* Dynamic Status Badge */}
                      <td className="px-8 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tighter ${status.color}`}
                        >
                          <StatusIcon size={12} />
                          {status.label}
                        </span>
                      </td>

                      {/* Dates */}
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-foreground font-semibold">
                            {new Date(record.dueDate).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Borrowed:{" "}
                            {new Date(record.borrowDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      {/* Return Action */}
                      <td className="px-8 py-5 text-right">
                        {!record.returnDate ? (
                          <Button
                            size="sm"
                            variant="primary"
                            icon={RotateCcw}
                            className="rounded-xl font-bold py-1.5 h-9"
                            onClick={() => {
                              setSelectedRecord(record);
                              setIsReturnModalOpen(true);
                            }}
                          >
                            Return Book
                          </Button>
                        ) : (
                          <div className="flex flex-col items-end pr-2 text-emerald-500">
                            <span className="text-[10px] font-black uppercase">
                              Returned On
                            </span>
                            <span className="text-xs font-bold">
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
                    className="px-8 py-20 text-center text-muted-foreground italic"
                  >
                    No borrowing records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
