import { Loader2, Check, X, Edit, Trash2 } from "lucide-react";
import Button from "../ui/Button";

export default function BookAdminActions({
  isEditing,
  isSaving,
  isDeleting,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}) {
  return (
    <div className="flex flex-wrap gap-3 pt-4 border-t border-border-subtle">
      {isEditing ? (
        <>
          <Button
            variant="primary"
            icon={isSaving ? Loader2 : Check}
            className={`px-8 rounded-xl font-bold ${isSaving ? "[&_svg]:animate-spin" : ""}`}
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>

          <Button
            variant="ghost"
            icon={X}
            className="px-8 rounded-xl font-bold"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="primary"
            icon={Edit}
            className="px-8 rounded-xl font-bold"
            onClick={onEdit}
          >
            Edit Book
          </Button>
          <Button
            variant="danger"
            icon={isDeleting ? Loader2 : Trash2}
            className={`px-8 rounded-xl font-bold ${isDeleting ? "[&_svg]:animate-spin" : ""}`}
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Book"}
          </Button>
        </>
      )}
    </div>
  );
}
