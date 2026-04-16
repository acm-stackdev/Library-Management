import { useState, useEffect } from "react";
import { Trash2, Search, Mail, ShieldCheck, UserCog } from "lucide-react";

// Services & Context
import { adminService, roleService } from "../../services/apiservices";
import { useToast } from "../../context/ToastContext";

// UI Components
import Button from "../../components/ui/Button";
import LoadingState from "../../components/ui/LoadingState";
import ConfirmModal from "../../components/ui/ConfirmModal";
import FormDropdown from "../../components/ui/FormDropdown"; // Your new Headless UI component

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToast();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch Users & Roles ──
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [userData, rolesData] = await Promise.all([
        adminService.getAllUsers(),
        roleService.getAll(),
      ]);
      setUsers(userData);

      // Map roles for the dropdown (Headless UI likes id/name pairs)
      setAvailableRoles(rolesData.map((r) => ({ id: r.name, name: r.name })));
    } catch (error) {
      toast.error("Failed to sync with library database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // ── Role Assignment ──
  const handleRoleChange = async (userId, newRoleName) => {
    try {
      await roleService.assignRole(userId, newRoleName);
      toast.success(`Access updated: ${newRoleName}`);

      // Update local state instantly
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, roles: [newRoleName] } : u)),
      );
    } catch (error) {
      toast.error("Role update failed. Verify admin permissions.");
    }
  };

  // ── Delete Logic ──
  const executeDelete = async () => {
    if (!userToDelete) return;
    try {
      setIsDeleting(true);
      await adminService.deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      toast.success("User permanently removed");
    } catch (error) {
      toast.error("Could not delete user");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(query.toLowerCase()),
  );

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-2xl">
            <UserCog className="text-accent w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              User Management
            </h1>
            <p className="text-muted-foreground text-sm">
              Control access levels and manage member accounts.
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-card border border-border-subtle rounded-2xl text-sm focus:ring-4 focus:ring-accent/10 outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border-subtle rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-muted/20 border-b border-border-subtle">
                <th className="px-8 py-5 font-black text-muted-foreground uppercase text-[10px] tracking-widest">
                  Member Info
                </th>
                <th className="px-8 py-5 font-black text-muted-foreground uppercase text-[10px] tracking-widest text-center">
                  Current Access
                </th>
                <th className="px-8 py-5 font-black text-muted-foreground uppercase text-[10px] tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-muted/5 transition-colors group"
                >
                  {/* Member Profile */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-accent to-accent/60 flex items-center justify-center text-white font-black shadow-inner">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-base tracking-tight">
                          {user.name || "Library Member"}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 font-medium">
                          <Mail size={12} strokeWidth={2.5} /> {user.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* ── CLEAN DROPDOWN COLUMN ── */}
                  <td className="px-8 py-6 text-center">
                    <div className="w-48 mx-auto">
                      <FormDropdown
                        size="sm"
                        icon={ShieldCheck}
                        options={availableRoles}
                        value={user.roles?.[0]}
                        onChange={(newRole) =>
                          handleRoleChange(user.id, newRole)
                        }
                        className={
                          user.roles?.includes("Admin")
                            ? "border-red-500/30 text-red-500"
                            : ""
                        }
                      />
                    </div>
                  </td>

                  {/* Danger Zone Actions */}
                  <td className="px-8 py-6 text-right">
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      className="rounded-xl px-5 font-bold"
                      onClick={() => {
                        setUserToDelete(user);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        loading={isDeleting}
        title="Remove User"
        message={`Are you sure you want to delete ${userToDelete?.name}? This action is permanent and will clear their library history.`}
      />
    </div>
  );
}
