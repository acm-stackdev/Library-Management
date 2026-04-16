import { User, Hash, Calendar, Layers } from "lucide-react";
import Detail from "../ui/Detail";
import EditInput from "../ui/EditInput";

export default function BookMetadataForm({
  book,
  isEditing,
  editData,
  handleChange,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-muted/5 rounded-2xl border border-border-subtle/50">
      {isEditing ? (
        <>
          <EditInput
            label="Author(s)"
            icon={User}
            name="authorNames"
            value={editData.authorNames.join(", ")}
            onChange={handleChange}
            placeholder="Author 1, Author 2"
          />
          <EditInput
            label="ISBN"
            icon={Hash}
            name="isbn"
            value={editData.isbn}
            onChange={handleChange}
            placeholder="ISBN Number"
          />
          <EditInput
            label="Published"
            icon={Calendar}
            name="publishedYear"
            type="number"
            value={editData.publishedYear}
            onChange={handleChange}
            placeholder="Year"
          />
          <EditInput
            label="Pages"
            icon={Layers}
            name="totalPages"
            type="number"
            value={editData.totalPages}
            onChange={handleChange}
            placeholder="Total Pages"
          />
        </>
      ) : (
        <>
          <Detail
            icon={User}
            label="Author"
            value={book.authorNames?.join(", ") || "Unknown Author"}
          />
          <Detail icon={Hash} label="ISBN" value={book.isbn || "N/A"} />
          <Detail
            icon={Calendar}
            label="Published"
            value={String(book.publishedYear || "Unknown")}
          />
          <Detail
            icon={Layers}
            label="Pages"
            value={String(book.totalPages || "N/A")}
          />
        </>
      )}
    </div>
  );
}
