export default function BookHeader({
  book,
  coverColor,
  isEditing,
  editData,
  categories,
  handleChange,
  isAddingCategory,
  newCategoryName,
  setNewCategoryName,
}) {
  return (
    <div
      className="h-40 flex items-end p-8"
      style={{ backgroundColor: coverColor }}
    >
      {isEditing ? (
        <div className="w-full space-y-2">
          {/* Category selector */}
          <div className="flex flex-wrap gap-2 items-center">
            <select
              name="categoryId"
              value={isAddingCategory ? "new" : editData.categoryId}
              onChange={handleChange}
              className="bg-card text-foreground text-xs font-bold tracking-widest uppercase p-1.5 rounded-lg border border-border-subtle shadow-sm outline-hidden focus:ring-2 focus:ring-accent/50"
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((cat) => (
                <option
                  key={cat.categoryId ?? cat.id}
                  value={cat.categoryId ?? cat.id}
                  className="bg-card text-foreground"
                >
                  {cat.categoryName ?? cat.name ?? "Unnamed Category"}
                </option>
              ))}
              <option value="new" className="bg-card text-accent font-bold">
                + ADD NEW CATEGORY
              </option>
            </select>

            {isAddingCategory && (
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                autoFocus
                className="bg-white/20 text-white text-xs font-bold p-1.5 rounded border border-white/40 outline-hidden placeholder:text-white/50"
              />
            )}
          </div>

          {/* Title input */}
          <input
            name="title"
            value={editData.title}
            onChange={handleChange}
            placeholder="Book Title"
            className="w-full bg-transparent text-3xl md:text-4xl font-black text-white tracking-tight border-b-2 border-white/50 outline-hidden focus:border-white"
          />
        </div>
      ) : (
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-white/70">
            {book.categoryName}
          </span>
          <h2 className="text-3xl md:text-4xl font-black mt-1 text-white tracking-tight">
            {book.title}
          </h2>
        </div>
      )}
    </div>
  );
}
