import { useState, useEffect, useCallback } from "react";
import { borrowService } from "../../services/apiservices";
import { useToast } from "../../context/useToast";
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

  const fetchLoans = useCallback(async () => {
    try {
      setLoading(true);
      const data = await borrowService.getMyHistory();
      setLoans(data);
    } catch {
      toast.error("Failed to sync lending records");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

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
    <div className="space-y-12 pb-10 animate-in fade-in duration-500">
      {/* ── Active Loans Section ── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-xl sm:text-2xl flex items-center gap-3 text-foreground">
            <Clock size={24} className="text-accent" />
            Currently Reading
          </h3>
          <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest">
            {activeLoans.length} Active
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {activeLoans.length > 0 ? (
            activeLoans.map((loan) => {
              const isOverdue = new Date(loan.dueDate) < new Date();
              return (
                <div
                  key={loan.borrowRecordId}
                  className="bg-card border border-border-subtle rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm border-l-4 border-l-accent group hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4 w-full min-w-0">
                    <div className="w-12 h-12 shrink-0 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                      <Book size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg sm:text-xl leading-tight truncate text-foreground group-hover:text-accent transition-colors">
                        {loan.bookTitle}
                      </h4>
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                            isOverdue
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          }`}
                        >
                          Due: {new Date(loan.dueDate).toLocaleDateString()}
                        </span>
                        {isOverdue && (
                          <span className="text-[10px] font-black text-red-500 flex items-center gap-1.5 animate-pulse">
                            <AlertCircle size={14} /> OVERDUE
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-muted-foreground">
                          ID: {loan.borrowRecordId}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    icon={RotateCcw}
                    className="w-full sm:w-auto rounded-xl font-bold px-8 py-3.5 sm:py-2.5 shadow-lg shadow-accent/20"
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
            <div className="p-12 sm:p-20 border-2 border-dashed border-border-subtle rounded-3xl text-center">
              <Book className="mx-auto text-muted-foreground/20 mb-4" size={48} />
              <p className="text-muted-foreground font-medium italic">
                Your reading shelf is empty. Time to discover something new!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── History Section ── */}
      <section className="space-y-6">
        <h3 className="font-black text-xl sm:text-2xl flex items-center gap-3 text-foreground">
          <History size={24} className="text-muted-foreground" />
          Reading History
        </h3>

        {/* Desktop History Table */}
        <div className="hidden md:block bg-card border border-border-subtle rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/30 border-b border-border-subtle text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-8 py-5">Book Title</th>
                  <th className="px-8 py-5 text-center">Borrowed On</th>
                  <th className="px-8 py-5 text-right">Status / Returned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {pastLoans.length > 0 ? (
                  pastLoans.map((loan) => (
                    <tr
                      key={loan.borrowRecordId}
                      className="hover:bg-muted/5 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <span className="font-bold text-foreground group-hover:text-accent transition-colors">
                          {loan.bookTitle}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center text-muted-foreground font-medium">
                        {new Date(loan.borrowDate).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="inline-flex items-center gap-2 text-emerald-500 font-bold bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
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
                      className="px-8 py-20 text-center text-muted-foreground italic font-medium"
                    >
                      Your history will appear here once you return your first book.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile History Cards */}
        <div className="md:hidden space-y-4">
          {pastLoans.length > 0 ? (
            pastLoans.map((loan) => (
              <div
                key={loan.borrowRecordId}
                className="bg-card border border-border-subtle rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    Book Title
                  </span>
                  <h4 className="font-bold text-foreground text-base leading-tight">
                    {loan.bookTitle}
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-subtle/50">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                      Borrowed
                    </span>
                    <p className="text-sm font-semibold text-foreground">
                      {new Date(loan.borrowDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">
                      Returned
                    </span>
                    <div className="flex items-center justify-end gap-1.5 text-emerald-600 font-bold text-sm">
                      <CheckCircle2 size={14} />
                      {new Date(loan.returnDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-card border border-border-subtle rounded-2xl p-10 text-center text-muted-foreground italic text-sm">
              No reading history yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

