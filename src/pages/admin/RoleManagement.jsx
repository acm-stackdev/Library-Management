import { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
} from "lucide-react";
import { roleService } from "../../services/apiservices";
import { useToast } from "../../context/useToast";
import Button from "../../components/ui/Button";
import LoadingState from "../../components/ui/LoadingState";
import ConfirmModal from "../../components/ui/ConfirmModal";

export default function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoleName, setNewRoleName] = useState("");
  const [editingRole, setEditingRole] = useState(null); // { id, name }
  const [editName, setEditName] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  const toast = useToast();

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await roleService.getAll();
      setRoles(data);
    } catch {
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    try {
      await roleService.create(newRoleName);
      toast.success(`Role "${newRoleName}" created`);
      setNewRoleName("");
      fetchRoles();
    } catch {
      toast.error("Failed to create role");
    }
  };

  const handleUpdateRole = async () => {
    try {
      await roleService.update(editingRole.id, editName);
      toast.success("Role updated");
      setEditingRole(null);
      fetchRoles();
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleDeleteRole = async () => {
    try {
      await roleService.delete(roleToDelete.id);
      toast.success("Role deleted");
      setRoles(roles.filter((r) => r.id !== roleToDelete.id));
    } catch {
      toast.error("Cannot delete role. It may be assigned to users.");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Role & Security</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Define and manage system-wide access levels.
        </p>
      </div>

      {/* Create Role Section */}
      <div className="bg-card border border-border-subtle rounded-2xl p-6 shadow-sm">
        <form
          onSubmit={handleCreateRole}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
              New Role Name
            </label>
            <input
              type="text"
              placeholder="e.g. Moderator, Librarian..."
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border-subtle rounded-xl text-sm focus:ring-2 focus:ring-accent/40 outline-hidden"
            />
          </div>
          <div className="flex items-end">
            <Button
              type="submit"
              variant="primary"
              icon={Plus}
              className="w-full sm:w-auto h-[46px]"
            >
              Create Role
            </Button>
          </div>
        </form>
      </div>

      {/* Roles List */}
      <div className="bg-card border border-border-subtle rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/30 border-b border-border-subtle">
            <tr>
              <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px]">
                Role Details
              </th>
              <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-muted/5 transition-colors">
                <td className="px-6 py-4">
                  {editingRole?.id === role.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-3 py-1 bg-background border border-accent rounded-lg text-sm outline-hidden"
                      />
                      <button
                        onClick={handleUpdateRole}
                        className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setEditingRole(null)}
                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground flex items-center gap-2">
                        <ShieldCheck size={14} className="text-accent" />
                        {role.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono mt-1">
                        ID: {role.id}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingRole(role);
                        setEditName(role.name);
                      }}
                      className="p-2 text-muted-foreground hover:text-accent transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setRoleToDelete(role);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
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
        onConfirm={handleDeleteRole}
        title="Delete Role"
        message={`Are you sure you want to delete the role "${roleToDelete?.name}"? Users currently assigned to this role may lose access.`}
      />
    </div>
  );
}
