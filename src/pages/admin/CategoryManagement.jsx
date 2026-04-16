import { useState, useEffect } from "react";
import {
  Library,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  BookCopy,
} from "lucide-react";
import { categoriesService } from "../../services/apiservices";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/Button";
import LoadingState from "../../components/ui/LoadingState";
import ConfirmModal from "../../components/ui/ConfirmModal";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Create State
  const [newCategoryName, setNewCategoryName] = useState("");

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const toast = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await categoriesService.create({ name: newCategoryName });
      toast.success(`Category "${newCategoryName}" added`);
      setNewCategoryName("");
      fetchCategories();
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Catalog Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Organize your library by managing book categories.
        </p>
      </div>

      {/* ── Create Category Section ── */}
      <div className="bg-card border border-border-subtle rounded-3xl p-6 shadow-sm">
        <form
          onSubmit={handleCreate}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block ml-1">
              Add New Category
            </label>
            <div className="relative group">
              <Library
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-accent transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="e.g. Science Fiction, Biography..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-muted/20 border border-border-subtle rounded-2xl text-sm focus:ring-4 focus:ring-accent/10 outline-hidden transition-all"
              />
            </div>
          </div>
          <div className="flex items-end">
            <Button
              type="submit"
              variant="primary"
              icon={Plus}
              className="w-full sm:w-auto h-[50px] px-8 rounded-2xl font-bold"
            >
              Add Category
            </Button>
          </div>
        </form>
      </div>

      {/* ── Categories List ── */}
      <div className="bg-card border border-border-subtle rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="font-bold flex items-center gap-2">
            <BookCopy size={18} className="text-accent" />
            Active Categories
          </h2>
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
              size={14}
            />
            <input
              type="text"
              placeholder="Filter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted/10 border border-border-subtle rounded-xl text-xs focus:outline-hidden"
            />
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-muted/20 text-muted-foreground font-black uppercase text-[10px] tracking-widest">
            <tr>
              <th className="px-8 py-4">Category Name</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {filteredCategories.map((cat) => (
              <tr
                key={cat.categoryId}
                className="hover:bg-muted/5 transition-colors group"
              >
                <td className="px-8 py-5">
                  {editingId === cat.categoryId ? (
                    <div className="flex items-center gap-2 animate-in zoom-in-95 duration-200">
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-4 py-2 bg-background border border-accent rounded-xl text-sm outline-hidden shadow-inner w-64"
                      />
                      <button
                        onClick={() => handleUpdate(cat.categoryId)}
                        className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-colors"
                      >
                        <Check size={18} strokeWidth={3} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        <X size={18} strokeWidth={3} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent/40" />
                      <span className="font-bold text-foreground text-base tracking-tight">
                        {cat.name}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingId(cat.categoryId);
                        setEditName(cat.name);
                      }}
                      className="p-2.5 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-xl transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setCategoryToDelete(cat);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
