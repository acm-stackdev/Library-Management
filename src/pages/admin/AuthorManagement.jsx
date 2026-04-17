import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Trash2,
  Search,
  Edit2,
  Check,
  X,
  UserPlus,
} from "lucide-react";

import { authorsService } from "../../services/apiservices";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/Button";
import LoadingState from "../../components/ui/LoadingState";
import ConfirmModal from "../../components/ui/ConfirmModal";

export default function AuthorManagement() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newAuthorName, setNewAuthorName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    author: null,
  });

  const toast = useToast();

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const data = await authorsService.getAll();
      setAuthors(data);
    } catch (error) {
      toast.error("Failed to sync author database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newAuthorName.trim()) return;
    try {
      setIsAdding(true);
      await authorsService.create({ name: newAuthorName });
      toast.success(`"${newAuthorName}" added to system`);
      setNewAuthorName("");
      fetchAuthors();
    } catch (err) {
      toast.error("Could not create author");
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    try {
      setIsUpdating(true);
      await authorsService.update(id, { authorId: id, name: editName });
      toast.success("Author renamed successfully");
      setEditingId(null);
      fetchAuthors();
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await authorsService.delete(deleteModal.author.authorId);
      toast.success("Author removed from catalog");
      fetchAuthors();
    } catch (err) {
      toast.error("Delete restricted: Author likely has active books.");
    } finally {
      setDeleteModal({ isOpen: false, author: null });
    }
  };

  const filtered = authors.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <UserPlus className="text-accent" size={22} />
          Author Management
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage the author database
        </p>
      </div>

      {/* ── Two Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Add Author ── */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border-subtle rounded-3xl p-6 shadow-sm sticky top-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <UserPlus size={14} className="text-accent" />
              New Author
            </h2>
            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              <div className="relative group">
                <Users
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-accent transition-colors"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Enter author name..."
                  value={newAuthorName}
                  onChange={(e) => setNewAuthorName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-muted/20 border border-border-subtle rounded-2xl text-sm focus:ring-4 focus:ring-accent/10 outline-hidden transition-all"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                icon={Plus}
                isLoading={isAdding}
                disabled={!newAuthorName.trim()}
                className="w-full h-11 rounded-2xl font-bold"
              >
                Add Author
              </Button>
            </form>

            {/* Stats */}
            <div className="mt-6 pt-5 border-t border-border-subtle">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black mb-3">
                Overview
              </p>
              <div className="flex items-center justify-between bg-muted/10 rounded-2xl px-4 py-3">
                <span className="text-sm text-muted-foreground">
                  Total Authors
                </span>
                <span className="text-lg font-black text-accent">
                  {authors.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Authors List ── */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border-subtle rounded-3xl shadow-sm overflow-hidden">
            {/* List Header */}
            <div className="p-5 border-b border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-3">
              <h2 className="font-bold flex items-center gap-2 text-sm">
                <Users size={16} className="text-accent" />
                All Authors
                <span className="ml-1 text-[10px] font-black bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                  {filtered.length}
                </span>
              </h2>
              <div className="relative w-full sm:w-56">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                  size={13}
                />
                <input
                  type="text"
                  placeholder="Search authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-muted/10 border border-border-subtle rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-accent/10 transition-all"
                />
              </div>
            </div>

            {/* Author Rows — hidden scrollbar */}
            <div
              className="overflow-y-auto max-h-[460px]"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style>{`.no-sb::-webkit-scrollbar { display: none; }`}</style>

              {filtered.length > 0 ? (
                <ul className="divide-y divide-border-subtle no-sb">
                  {filtered.map((author, index) => (
                    <li
                      key={author.authorId}
                      className="group flex items-center justify-between px-5 py-3.5 hover:bg-muted/5 transition-colors"
                    >
                      {/* Left: index + avatar + name */}
                      {editingId === author.authorId ? (
                        <div className="flex items-center gap-2 flex-1 animate-in zoom-in-95 duration-200">
                          <input
                            autoFocus
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-background border border-accent rounded-xl text-sm outline-hidden shadow-inner max-w-xs"
                          />
                          <button
                            onClick={() => handleUpdate(author.authorId)}
                            disabled={isUpdating}
                            className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                          >
                            <Check size={16} strokeWidth={3} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <X size={16} strokeWidth={3} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-[10px] font-black text-muted-foreground/40 w-5 text-right shrink-0">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-xs font-black shrink-0">
                            {author.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-sm text-foreground truncate">
                            {author.name}
                          </span>
                        </div>
                      )}

                      {/* Right: action buttons */}
                      {editingId !== author.authorId && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4">
                          <button
                            onClick={() => {
                              setEditingId(author.authorId);
                              setEditName(author.name);
                            }}
                            className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-xl transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({ isOpen: true, author })
                            }
                            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                  <Users size={32} className="opacity-20" />
                  <p className="text-sm italic">
                    {searchQuery
                      ? `No authors matching "${searchQuery}"`
                      : "No authors yet."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, author: null })}
        onConfirm={handleDelete}
        title="Remove Author"
        message={`Are you sure you want to delete "${deleteModal.author?.name}"? This may be restricted if the author has active books.`}
      />
    </div>
  );
}
