import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Shield, UploadCloud, Check } from 'lucide-react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/api/users';
import { useRolesQuery, useCreateRole, useDeleteRole } from '@/api/roles';
import { mediaApi } from '@/api/media';
import { AdminDataTable, Column } from '@/components/shared/AdminDataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { useUiStore } from '@/store/uiStore';
import { UserDto, RoleDto } from '@/types/api';

export const AdminUsersPage: React.FC = () => {
  const { data: users = [], isLoading } = useUsers();
  const { data: roles = [] } = useRolesQuery();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const createRoleMutation = useCreateRole();
  const deleteRoleMutation = useDeleteRole();
  const { addToast } = useUiStore();

  // User modal state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserDto | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRoleId, setUserRoleId] = useState('');
  const [userProfileImage, setUserProfileImage] = useState('');

  // Roles modal state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  // Media upload modal state
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const openUserModal = (user?: UserDto) => {
    if (user) {
      setEditingUser(user);
      setUserName(user.name || '');
      setUserEmail(user.email || '');
      setUserPassword('');
      setUserRoleId(String((user as any).roleId || (roles[0]?.id ? roles[0].id : '1')));
      setUserProfileImage(user.profileImage || '');
    } else {
      setEditingUser(null);
      setUserName('');
      setUserEmail('');
      setUserPassword('');
      setUserRoleId(String(roles[0]?.id ? roles[0].id : '1'));
      setUserProfileImage('');
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userName.trim() || userName.trim().length < 2) {
      addToast({ type: 'warning', title: 'Invalid Name', message: 'Name must be at least 2 characters.' });
      return;
    }
    if (!userEmail.trim() || !emailRegex.test(userEmail.trim())) {
      addToast({ type: 'warning', title: 'Invalid Email', message: 'Please provide a valid email address.' });
      return;
    }
    if (!editingUser && (!userPassword || userPassword.length < 6)) {
      addToast({ type: 'warning', title: 'Invalid Password', message: 'Password must be at least 6 characters long.' });
      return;
    }
    if (editingUser && userPassword && userPassword.length < 6) {
      addToast({ type: 'warning', title: 'Invalid Password', message: 'New password must be at least 6 characters long.' });
      return;
    }

    try {
      if (editingUser) {
        await updateUserMutation.mutateAsync({
          id: editingUser.id,
          dto: {
            id: editingUser.id,
            name: userName.trim(),
            email: userEmail.trim(),
            password: userPassword || undefined,
            profileImage: userProfileImage || undefined,
          },
        });
        addToast({ type: 'success', title: 'User Updated', message: `User "${userName}" was updated successfully.` });
      } else {
        await createUserMutation.mutateAsync({
          name: userName.trim(),
          email: userEmail.trim(),
          password: userPassword,
          profileImage: userProfileImage || undefined,
        });
        addToast({ type: 'success', title: 'User Created', message: `User "${userName}" was created successfully.` });
      }
      setIsUserModalOpen(false);
    } catch (err: any) {
      addToast({ type: 'error', title: 'Operation Failed', message: err?.message || 'Could not save user.' });
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    try {
      await createRoleMutation.mutateAsync({ roleName: newRoleName.trim() });
      addToast({ type: 'success', title: 'Role Created', message: `Role "${newRoleName}" has been created.` });
      setNewRoleName('');
    } catch (err: any) {
      addToast({ type: 'error', title: 'Role Creation Failed', message: err?.message || 'Could not create role.' });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingMedia(true);
    try {
      const url = await mediaApi.upload(file);
      setUploadedUrl(url);
      addToast({ type: 'success', title: 'Media Uploaded', message: 'Asset successfully uploaded to /api/Media.' });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Upload Failed', message: err?.message || 'Could not upload media.' });
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const columns: Column<UserDto>[] = [
    {
      key: 'name',
      header: 'User / Member',
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-3">
          <img
            src={
              u.profileImage ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
            }
            alt=""
            className="w-9 h-9 rounded-full object-cover shrink-0 border border-[var(--color-border)]"
          />
          <div className="flex flex-col">
            <span className="font-bold text-sm text-[var(--color-text)]">{u.name}</span>
            <span className="text-xs text-[var(--color-text-subtle)]">{u.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (u) => {
        const roleStr = (u as any).roleName || u.role || 'Member';
        return roleStr.toLowerCase().includes('admin') ? (
          <Badge variant="admin" size="xs">
            Executive Admin
          </Badge>
        ) : roleStr.toLowerCase().includes('member') ? (
          <Badge variant="gradient" size="xs">
            Paid Member
          </Badge>
        ) : (
          <Badge variant="neutral" size="xs">
            {roleStr}
          </Badge>
        );
      },
    },
    {
      key: 'id',
      header: 'Subscription Tier',
      render: (u) => {
        const sub = (u as any).subscription;
        return sub ? (
          <span className="text-xs font-mono text-[var(--color-success)] font-bold">
            {sub.planType} (${sub.amount}) • {sub.status}
          </span>
        ) : (
          <span className="text-xs text-[var(--color-text-subtle)]">Standard Account</span>
        );
      },
    },
    {
      key: 'createdAt',
      header: 'Joined',
      sortable: true,
      render: (u) => new Date(u.createdAt || Date.now()).toLocaleDateString(),
    },
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-text)]">
            Registered Users & Roster Management
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
            Manage user accounts, configure system roles via /api/Role, and upload media assets via /api/Media.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRoleModalOpen(true)}
            leftIcon={<Shield className="w-4 h-4" />}
            className="flex-1 sm:flex-initial"
          >
            Manage Roles ({roles.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMediaModalOpen(true)}
            leftIcon={<UploadCloud className="w-4 h-4" />}
            className="flex-1 sm:flex-initial"
          >
            Media Storage
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => openUserModal()}
            leftIcon={<Plus className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-warm"
          >
            Add User
          </Button>
        </div>
      </div>

      <AdminDataTable
        columns={columns}
        data={Array.isArray(users) ? users : []}
        isLoading={isLoading}
        searchFields={['name', 'email']}
        searchPlaceholder="Search users by name or email..."
        renderActions={(user) => (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="xs"
              onClick={() => openUserModal(user)}
              title="Edit User"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setDeletingUser(user)}
              className="text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
              title="Delete User"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      />

      {/* User Create / Edit Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title={editingUser ? 'Edit User Account' : 'Create New User Account'}
        description="Set user profile credentials, role assignment, and security password."
        maxWidth="lg"
      >
        <form onSubmit={handleSaveUser} className="flex flex-col gap-4 text-left">
          <Input
            label="Full Name"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="e.g. Marcus Aurelius"
          />

          <Input
            label="Email Address"
            type="email"
            required
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="e.g. marcus@jamesthew.com"
          />

          <Input
            label={editingUser ? 'Password (Leave blank to keep unchanged)' : 'Password'}
            type="password"
            required={!editingUser}
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Select
            label="Role Assignment"
            options={roles.map((r: RoleDto) => ({
              value: String(r.id),
              label: r.roleName || (r as any).name || 'Role',
            }))}
            value={userRoleId}
            onChange={(e) => setUserRoleId(e.target.value)}
          />

          <Input
            label="Profile Image URL"
            value={userProfileImage}
            onChange={(e) => setUserProfileImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
          />

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsUserModalOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={createUserMutation.isPending || updateUserMutation.isPending}
              className="w-full sm:w-auto shadow-warm"
            >
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Roles Management Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Role Management (/api/Role)"
        description="View and configure system security access roles."
        maxWidth="lg"
      >
        <div className="flex flex-col gap-4 text-left">
          <form onSubmit={handleCreateRole} className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="New role name (e.g. SousChef, Sommelier)"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={createRoleMutation.isPending}
              className="w-full sm:w-auto"
            >
              Add Role
            </Button>
          </form>

          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pt-2 border-t border-[var(--color-border)]">
            {roles.map((r: RoleDto) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)]"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="font-bold text-xs text-[var(--color-text)]">{r.roleName || (r as any).name}</span>
                  <span className="text-[10px] font-mono text-[var(--color-text-subtle)]">(ID: {r.id})</span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm(`Delete role "${r.roleName || (r as any).name}"?`)) {
                      await deleteRoleMutation.mutateAsync(r.id);
                      addToast({ type: 'info', title: 'Role Deleted', message: 'Role was removed.' });
                    }
                  }}
                  className="p-1 rounded text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 cursor-pointer"
                  title="Delete Role"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2 border-t border-[var(--color-border)]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsRoleModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Media Management Modal */}
      <Modal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        title="Direct Media Asset Storage (/api/Media)"
        description="Upload images directly to the server multipart endpoint and retrieve hosted URLs."
        maxWidth="lg"
      >
        <div className="flex flex-col gap-4 text-left">
          <label className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] cursor-pointer hover:border-[var(--color-primary)] transition-all">
            <UploadCloud className="w-8 h-8 text-[var(--color-primary)] mb-2" />
            <span className="text-xs font-bold text-[var(--color-text)]">
              {isUploadingMedia ? 'Uploading image to /api/Media...' : 'Click to select and upload media file'}
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
              Supports JPEG, PNG, WEBP multipart payload (ImagePath)
            </span>
            <input
              type="file"
              accept="image/*"
              disabled={isUploadingMedia}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {uploadedUrl && (
            <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold text-[var(--color-success)] flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Uploaded URL:</span>
              </span>
              <Input value={uploadedUrl} readOnly />
              <img src={uploadedUrl} alt="Uploaded" className="w-full aspect-video rounded-lg object-cover" />
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-[var(--color-border)]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsMediaModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete User Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={async () => {
          if (deletingUser) {
            await deleteUserMutation.mutateAsync(deletingUser.id);
            addToast({ type: 'info', title: 'User Deleted', message: 'User account removed.' });
            setDeletingUser(null);
          }
        }}
        itemName={deletingUser?.name}
        isLoading={deleteUserMutation.isPending}
      />
    </div>
  );
};
