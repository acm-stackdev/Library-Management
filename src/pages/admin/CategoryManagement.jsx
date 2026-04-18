import { useState, useEffect, useCallback } from "react";
import {
  Library,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  BookCopy,
  Tag,
} from "lucide-react";
import { categoriesService } from "../../services/apiservices";
import { useToast } from "../../context/useToast";
import Button from "../../components/ui/Button";
import LoadingState from "../../components/ui/LoadingState";
import ConfirmModal from "../../components/ui/ConfirmModal";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const toast = useToast();

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await categoriesService.create({ name: newCategoryName });
      toast.success(`Category "${newCategoryName}" added`);
      setNewCategoryName("");
      fetchCategories();
    } catch {
      toast.error("Failed to create category");
    }
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    try {
      await categoriesService.update(id, { categoryId: id, name: editName });
      toast.success("Category renamed");
      setEditingId(null);
      fetchCategories();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    try {
      await categoriesService.delete(categoryToDelete.categoryId);
      toast.success("Category removed");
      setCategories(
        categories.filter((c) => c.categoryId !== categoryToDelete.categoryId),
      );
    } catch {
      toast.error(
        "Cannot delete category; it may be linked to existing books.",
      );
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <Tag className="text-accent" size={22} />
          Catalog Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Organize your library by managing book categories.
        </p>
      </div>

      {/* ── Two Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Add Category ── */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border-subtle rounded-3xl p-6 shadow-sm sticky top-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <Library size={14} className="text-accent" />
              New Category
            </h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <div className="relative group">
                <Library
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-accent transition-colors"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="e.g. Science Fiction..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-muted/20 border border-border-subtle rounded-2xl text-sm focus:ring-4 focus:ring-accent/10 outline-hidden transition-all"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                icon={Plus}
                className="w-full h-11 rounded-2xl font-bold"
              >
                Add Category
              </Button>
            </form>

            {/* Stats */}
            <div className="mt-6 pt-5 border-t border-border-subtle">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black mb-3">
                Overview
              </p>
              <div className="flex items-center justify-between bg-muted/10 rounded-2xl px-4 py-3">
                <span className="text-sm text-muted-foreground">
                  Total Categories
                </span>
                <span className="text-lg font-black text-accent">
                  {categories.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Categories List ── */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border-subtle rounded-3xl shadow-sm overflow-hidden">
            {/* List Header */}
            <div className="p-5 border-b border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-3">
              <h2 className="font-bold flex items-center gap-2 text-sm">
                <BookCopy size={16} className="text-accent" />
                Active Categories
                <span className="ml-1 text-[10px] font-black bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                  {filteredCategories.length}
                </span>
              </h2>
              <div className="relative w-full sm:w-56">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                  size={13}
                />
                <input
                  type="text"
                  placeholder="Filter categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-muted/10 border border-border-subtle rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-accent/10 transition-all"
                />
              </div>
            </div>

            {/* Category Rows — hidden scrollbar */}
            <div
              className="overflow-y-auto max-h-[460px]"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style>{`.no-sb::-webkit-scrollbar { display: none; }`}</style>

              {filteredCategories.length > 0 ? (
                <ul className="divide-y divide-border-subtle no-sb">
                  {filteredCategories.map((cat, index) => (
                    <li
                      key={cat.categoryId}
                      className="group flex items-center justify-between px-5 py-3.5 hover:bg-muted/5 transition-colors"
                    >
                      {/* Left: index + name */}
                      {editingId === cat.categoryId ? (
                        <div className="flex items-center gap-2 flex-1 animate-in zoom-in-95 duration-200">
                          <input
                            autoFocus
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-background border border-accent rounded-xl text-sm outline-hidden shadow-inner max-w-xs"
                          />
                          <button
                            onClick={() => handleUpdate(cat.categoryId)}
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
                          <div className="w-1.5 h-1.5 rounded-full bg-accent/50 shrink-0" />
                          <span className="font-semibold text-sm text-foreground truncate">
                            {cat.name}
                          </span>
                        </div>
                      )}

                      {/* Right: action buttons */}
                      {editingId !== cat.categoryId && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4">
                          <button
                            onClick={() => {
                              setEditingId(cat.categoryId);
                              setEditName(cat.name);
                            }}
                            className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-xl transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setCategoryToDelete(cat);
                              setIsDeleteModalOpen(true);
                            }}
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
                  <BookCopy size={32} className="opacity-20" />
                  <p className="text-sm italic">No categories found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to remove "${categoryToDelete?.name}"? Books currently in this category will become uncategorized.`}
      />
    </div>
  );
}
