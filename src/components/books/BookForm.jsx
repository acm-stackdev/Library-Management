import { useState, useEffect } from "react";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import {
  BookText,
  User,
  Hash,
  Tag,
  AlignLeft,
  Calendar,
  FileText,
} from "lucide-react";
import FormSelect from "../ui/FormSelect";
import { categoriesService } from "../../services/apiservices";
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
        console.log("MY CATEGORIES FROM API:", data);
        setCategories(data);
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
    if (payload.categoryId === 0) {
      setError("Please select a valid category.");
      return; // Stop execution
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
        <FormSelect
          icon={Tag}
          placeholder="Category"
          options={categories.map((c) => ({
            id: c.categoryId,
            name: c.name,
          }))}
          value={formData.categoryId}
          onChange={(e) =>
            setFormData({ ...formData, categoryId: e.target.value })
          }
          required
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

      {/* Render the error if it exists */}
      {error && <FormError message={error} />}

      <Button
        type="submit"
        variant="primary"
        className="w-full rounded-xl py-4 font-bold"
        isLoading={loading}
      >
        Create Book
      </Button>
    </form>
  );
}
