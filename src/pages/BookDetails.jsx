import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Services & Context
import {
  booksService,
  categoriesService,
  wishlistService,
  borrowService,
} from "../services/apiservices";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";

// UI Components
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import ConfirmModal from "../components/ui/ConfirmModal";

// Feature Components
import BookHeader from "../components/books/BookHeader";
import BookCover from "../components/books/BookCover";
import BookDescription from "../components/books/BookDescription";
import BookMetadataForm from "../components/books/BookMetadataForm";
import BookUserActions from "../components/books/BookUserActions";
import BookAdminActions from "../components/books/BookAdminActions";

const EMPTY_EDIT = {
  title: "",
  isbn: "",
  categoryId: "",
  publishedYear: "",
  description: "",
  totalPages: "",
  authorNames: [],
};

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes("Admin");
  const toast = useToast();

  // ── Data State ──
  const [book, setBook] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── UI & Wishlist State ──
  const [isLiked, setIsLiked] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Form State ──
  const [editData, setEditData] = useState(EMPTY_EDIT);

  // ── Fetch Book ──
  useEffect(() => {
    let cancelled = false;
    const fetchBook = async () => {
      try {
        setLoading(true);
        const data = await booksService.getById(id);
        if (!cancelled) setBook(data);
      } catch {
        if (!cancelled) setError("Could not find the book you're looking for.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBook();
    window.scrollTo(0, 0);
    return () => {
      cancelled = true;
    };
  }, [id]);

  // ── Fetch Wishlist Status ──
  useEffect(() => {
    if (!user || !id) return;

    const checkWishlistStatus = async () => {
      try {
        const myWishlist = await wishlistService.getAll();
        const savedItem = myWishlist.find(
          (item) => item.bookId === parseInt(id),
        );

        if (savedItem) {
          setIsLiked(true);
          setWishlistId(savedItem.wishlistId);
        }
      } catch (err) {
        console.error("Failed to check wishlist status", err);
      }
    };
    checkWishlistStatus();
  }, [id, user]);

  // ── Fetch Categories (Admin Only) ──
  useEffect(() => {
    if (!isAdmin) return;
    categoriesService
      .getAll()
      .then(setCategories)
      .catch((err) => console.error("Error fetching categories:", err));
  }, [isAdmin]);

  // ── Handlers ──
  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error("Please log in to save books to your wishlist.");
      return;
    }

    try {
      setIsWishlistLoading(true);

      if (isLiked) {
        await wishlistService.delete(wishlistId);
        setIsLiked(false);
        setWishlistId(null);
        toast.success("Removed from wishlist");
        window.dispatchEvent(new Event("wishlistUpdated"));
      } else {
        const response = await wishlistService.postById(id);
        setIsLiked(true);
        setWishlistId(response.wishlistId);
        toast.success("Added to wishlist!");
        window.dispatchEvent(new Event("wishlistUpdated"));
      }
    } catch (err) {
      toast.error("Failed to update wishlist");
      console.error(err);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // ── The Borrow Logic ──
  const handleBorrow = async () => {
    if (!user) {
      toast.error("Please log in to borrow books.");
      return;
    }

    try {
      setIsBorrowing(true);
      await borrowService.borrowBook(id);

      toast.success("Success! You've borrowed this book.");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        "Unable to borrow book.";

      toast.error(errorMessage);
    } finally {
      setIsBorrowing(false);
    }
  };

  const handleEditClick = () => {
    setEditData({
      title: book.title,
      isbn: book.isbn || "",
      categoryId: book.categoryId,
      publishedYear: book.publishedYear || "",
      description: book.description || "",
      totalPages: book.totalPages || "",
      authorNames: book.authorNames || [],
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(EMPTY_EDIT);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "categoryId") {
      const catId = value === "" ? "" : parseInt(value, 10);
      setEditData((prev) => ({ ...prev, categoryId: catId }));
      return;
    }

    if (name === "authorNames") {
      setEditData((prev) => ({
        ...prev,
        authorNames: value.split(",").map((s) => s.trim()),
      }));
      return;
    }

    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const payload = {
        title: editData.title,
        isbn: editData.isbn,
        categoryId: parseInt(editData.categoryId, 10),
        publishedYear: parseInt(editData.publishedYear, 10) || 0,
        description: editData.description,
        totalPages: parseInt(editData.totalPages, 10) || 0,
        authorNames: editData.authorNames,
      };

      await booksService.update(id, payload);
      const refreshed = await booksService.getById(id);
      setBook(refreshed);
      handleCancel();

      window.dispatchEvent(new Event("bookCreated"));
      toast.success("Book saved successfully");
    } catch (err) {
      console.error("Error saving book:", err);
      toast.error("Failed to save book");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    try {
      setIsDeleting(true);
      await booksService.delete(id);

      window.dispatchEvent(new Event("bookCreated"));

      toast.success("Book deleted successfully");
      navigate("/");
    } catch (err) {
      console.error("Error deleting book:", err);
      toast.error("Failed to delete book");
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  // ── Render Guards ──
  if (loading) return <LoadingState />;
  if (error || !book)
    return <ErrorState message={error} onBack={() => navigate("/")} />;

  // ── Derived Values ──
  const coverUrl =
    book.imageUrl ||
    (book.isbn
      ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`
      : null);
  const coverColor = book.coverColor || "var(--accent-main)";

  // ── JSX ──
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="bg-card rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
        <BookHeader
          book={book}
          coverColor={coverColor}
          isEditing={isEditing}
          editData={editData}
          categories={categories}
          handleChange={handleChange}
        />

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-10">
            <BookCover
              coverUrl={coverUrl}
              title={book.title}
              user={user}
              isEditing={isEditing}
              isLiked={isLiked}
              onToggleLike={handleToggleWishlist}
              isLoading={isWishlistLoading}
            />

            <div className="flex-1 space-y-8 my-auto">
              <BookDescription
                description={book.description}
                isEditing={isEditing}
                editData={editData}
                handleChange={handleChange}
              />

              <BookMetadataForm
                book={book}
                isEditing={isEditing}
                editData={editData}
                handleChange={handleChange}
              />

              {user && (isAdmin ? (
                <BookAdminActions
                  isEditing={isEditing}
                  isSaving={isSaving}
                  isDeleting={isDeleting}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onEdit={handleEditClick}
                  onDelete={handleDelete}
                />
              ) : (
                <BookUserActions
                  onBorrow={handleBorrow}
                  loading={isBorrowing}
                />
              ))}

              <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={executeDelete}
                title="Delete Book"
                message={`Are you sure you want to permanently delete "${book.title}"? This action cannot be undone.`}
                loading={isDeleting}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
