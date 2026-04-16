import FormSelect from "../ui/FormSelect";

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
      className="h-40 flex items-end p-8 transition-colors duration-500"
      style={{ backgroundColor: coverColor }}
    >
      {isEditing ? (
        <div className="w-full space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Category Dropdown */}
          <div className="w-64">
            <FormSelect
              name="categoryId"
              placeholder="Select Category"
              options={selectOptions}
              value={editData.categoryId}
              onChange={handleChange}
              className="py-2 px-3 text-xs font-bold tracking-widest uppercase rounded-lg border-white/20 bg-black/20 text-white backdrop-blur-md shadow-sm focus:ring-white/50"
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
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="text-xs font-bold tracking-widest uppercase text-white/80 drop-shadow-md">
            {book.categoryName}
          </span>
          <h2 className="text-3xl md:text-4xl font-black mt-1 text-white tracking-tight drop-shadow-lg">
            {book.title}
          </h2>
        </div>
      )}
    </div>
  );
}
