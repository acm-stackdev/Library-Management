import FormDropdown from "../ui/FormDropdown";
import { Tag } from "lucide-react";

export default function BookHeader({
  book,
  coverColor,
  isEditing,
  editData,
  categories,
  handleChange,
}) {
  const selectOptions = categories.map((cat) => ({
    id: cat.categoryId ?? cat.id,
    name: cat.categoryName ?? cat.name ?? "Unnamed Category",
  }));

  return (
    <div
      className="h-48 flex items-end p-8 transition-colors duration-500"
      style={{ backgroundColor: coverColor }}
    >
      {isEditing ? (
        <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* ── Category Dropdown ── */}
          <div className="w-64">
            <FormDropdown
              size="sm"
              icon={Tag}
              placeholder="Select Category"
              options={selectOptions}
              value={editData.categoryId}
              onChange={(val) =>
                handleChange({ target: { name: "categoryId", value: val } })
              }
              className="bg-black/20 text-white backdrop-blur-md border-white/20 shadow-lg z-10"
            />
          </div>

          {/* Title Input */}
          <input
            name="title"
            value={editData.title}
            onChange={handleChange}
            placeholder="Book Title"
            className="w-full bg-transparent text-3xl md:text-4xl font-black text-white tracking-tight border-b-2 border-white/30 outline-none focus:border-white pb-1 transition-colors placeholder:text-white/40"
          />
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 pb-1">
          <span className="text-xs font-black tracking-widest uppercase text-white/70 bg-white/10 px-2 py-1 rounded-md backdrop-blur-sm">
            {book.categoryName || "Uncategorized"}
          </span>
          <h2 className="text-3xl md:text-4xl font-black mt-2 text-white tracking-tight drop-shadow-lg">
            {book.title}
          </h2>
        </div>
      )}
    </div>
  );
}
