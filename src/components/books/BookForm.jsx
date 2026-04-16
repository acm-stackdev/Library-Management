import { useState, useEffect } from "react";
import {
  BookText,
  User,
  Hash,
  Tag,
  AlignLeft,
  Calendar,
  FileText,
} from "lucide-react";

// Services & Context
import { categoriesService } from "../../services/apiservices";

// UI Components
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import FormDropdown from "../ui/FormDropdown";
import FormError from "../ui/FormError";

export default function BookForm({ onSubmit, loading }) {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    categoryId: "",
    publishedYear: new Date().getFullYear(),
    description: "",
    totalPages: 0,
    authorNames: "",
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesService.getAll();
        // Ensure data is in the {id, name} format FormDropdown expects
        const mappedCategories = data.map((c) => ({
          id: c.categoryId,
          name: c.name,
        }));
        setCategories(mappedCategories);
      } catch (err) {
        console.error("Could not load categories", err);
      }
    };
    loadCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const forceNum = (val) => {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? 0 : parsed;
    };

    const payload = {
      title: formData.title.trim(),
      isbn: formData.isbn.trim(),
      categoryId: forceNum(formData.categoryId),
      publishedYear: forceNum(formData.publishedYear),
      description: formData.description.trim(),
      totalPages: forceNum(formData.totalPages),
      authorNames: formData.authorNames
        ? formData.authorNames
            .split(",")
            .map((a) => a.trim())
            .filter((a) => a !== "")
        : [],
    };

    // Validation
    if (!payload.categoryId || payload.categoryId === 0) {
      setError("Please select a valid category.");
      return;
    }

    if (payload.authorNames.length === 0) {
      setError("Please add at least one author.");
      return;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title & Category Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          icon={BookText}
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        {/* Category Dropdown */}
        <FormDropdown
          icon={Tag}
          placeholder="Category"
          options={categories}
          value={formData.categoryId}
          // 🔥 Note: Headless UI passes the value directly, not 'e'
          onChange={(val) => setFormData({ ...formData, categoryId: val })}
          size="md" // Keep it large for the form
        />
      </div>

      {/* Authors Input */}
      <FormInput
        icon={User}
        placeholder="Authors (comma separated)"
        value={formData.authorNames}
        onChange={(e) =>
          setFormData({ ...formData, authorNames: e.target.value })
        }
        required
      />

      <FormInput
        icon={Hash}
        placeholder="ISBN"
        value={formData.isbn}
        onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          icon={Calendar}
          type="number"
          placeholder="Year"
          value={formData.publishedYear}
          onChange={(e) =>
            setFormData({ ...formData, publishedYear: e.target.value })
          }
        />
        <FormInput
          icon={FileText}
          type="number"
          placeholder="Pages"
          value={formData.totalPages}
          onChange={(e) =>
            setFormData({ ...formData, totalPages: e.target.value })
          }
        />
      </div>

      <FormInput
        icon={AlignLeft}
        textarea
        placeholder="Brief description..."
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />

      {error && <FormError message={error} />}

      <Button
        type="submit"
        variant="primary"
        className="w-full rounded-xl py-4 font-bold"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Book"}
      </Button>
    </form>
  );
}
