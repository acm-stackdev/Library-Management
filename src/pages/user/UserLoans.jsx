import { useState, useEffect } from "react";
import { borrowService } from "../../services/apiservices";
import { useToast } from "../../context/ToastContext";
import {
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  History,
  Book,
} from "lucide-react";
import LoadingState from "../../components/ui/LoadingState";
import Button from "../../components/ui/Button";

export default function UserLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const data = await borrowService.getMyHistory();
      setLoans(data);
    } catch (error) {
      toast.error("Failed to sync lending records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleReturn = async (loanId, title) => {
    try {
      await borrowService.returnBook(loanId);
      toast.success(`Success! "${title}" is now returned.`);
      fetchLoans(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || "Return failed");
    }
  };

  const activeLoans = loans.filter((l) => !l.returnDate);
  const pastLoans = loans.filter((l) => l.returnDate);

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-10">
      {/* ── Active Loans Section ── */}
      <section className="space-y-4">
        <h3 className="font-black text-lg flex items-center gap-2 text-foreground">
          <Clock size={20} className="text-accent" />
          Currently Reading
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {activeLoans.length > 0 ? (
            activeLoans.map((loan) => {
              const isOverdue = new Date(loan.dueDate) < new Date();
              return (
                <div
                  key={loan.borrowRecordId}
                  className="bg-card border border-border-subtle rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm border-l-4 border-l-accent"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                      <Book size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg leading-tight">
                        {loan.bookTitle}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${isOverdue ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"}`}
                        >
                          Due: {new Date(loan.dueDate).toLocaleDateString()}
                        </span>
                        {isOverdue && (
                          <span className="text-[10px] font-black text-red-500 flex items-center gap-1 animate-pulse">
                            <AlertCircle size={12} /> OVERDUE
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    icon={RotateCcw}
                    className="w-full sm:w-auto rounded-xl font-bold px-8 shadow-lg shadow-accent/20"
                    onClick={() =>
                      handleReturn(loan.borrowRecordId, loan.bookTitle)
                    }
                  >
                    Return Book
                  </Button>
                </div>
              );
            })
          ) : (
            <div className="p-10 border border-dashed border-border-subtle rounded-3xl text-center text-muted-foreground italic">
              You don't have any books borrowed at the moment.
            </div>
          )}
        </div>
      </section>

      {/* ── History Section ── */}
      <section className="space-y-4 pt-4">
        <h3 className="font-black text-lg flex items-center gap-2 text-foreground">
          <History size={20} className="text-muted-foreground" />
          Reading History
        </h3>
        <div className="bg-card border border-border-subtle rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/30 border-b border-border-subtle text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-8 py-4">Book Title</th>
                <th className="px-8 py-4">Borrowed</th>
                <th className="px-8 py-4 text-right">Returned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {pastLoans.length > 0 ? (
                pastLoans.map((loan) => (
                  <tr
                    key={loan.borrowRecordId}
                    className="hover:bg-muted/5 transition-colors"
                  >
                    <td className="px-8 py-4 font-bold">{loan.bookTitle}</td>
                    <td className="px-8 py-4 text-muted-foreground">
                      {new Date(loan.borrowDate).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <span className="flex items-center justify-end gap-1.5 text-emerald-500 font-bold">
                        <CheckCircle2 size={14} />{" "}
                        {new Date(loan.returnDate).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-8 py-10 text-center text-muted-foreground italic"
                  >
                    No history yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
