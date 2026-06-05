import { useState } from "react";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useResetPasswordMutation,
} from "../../features/user/userManageApi";
import {
  Plus, Search, Edit2, Trash2, X, Loader2,
  Users, ChevronLeft, ChevronRight, KeyRound,
  ShieldCheck, ShieldAlert, User,
} from "lucide-react";

const ROLES = [
  { id: "admin",   label: "Admin",   color: "bg-purple-50 text-purple-700", icon: ShieldCheck  },
  { id: "manager", label: "Manager", color: "bg-blue-50 text-blue-700",     icon: ShieldAlert  },
  { id: "cashier", label: "Cashier", color: "bg-emerald-50 text-emerald-700", icon: User        },
];

const getRoleInfo = (role) => ROLES.find((r) => r.id === role) || ROLES[2];

// ─── User Modal ───────────────────────────────────────────
const UserModal = ({ onClose, editData }) => {
  const [form, setForm] = useState({
    name:     editData?.name  || "",
    email:    editData?.email || "",
    role:     editData?.role  || "cashier",
    password: "",
  });

  const [create, { isLoading: creating }] = useCreateUserMutation();
  const [update, { isLoading: updating }] = useUpdateUserMutation();
  const isLoading = creating || updating;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        const { password, ...rest } = form;
        await update({ id: editData._id, ...rest }).unwrap();
      } else {
        await create(form).unwrap();
      }
      onClose();
    } catch (err) {
      alert(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">
            {editData ? "Edit User" : "Add User"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <X size={17} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Ahmed Ali"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="e.g. ahmed@pos.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              required
            />
          </div>

          {!editData && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password *</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
                minLength={6}
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Role *</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button"
                  onClick={() => setForm({ ...form, role: id })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition text-sm font-medium
                    ${form.role === id
                      ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                    }`}>
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              {editData ? "Update" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Reset Password Modal ─────────────────────────────────
const ResetPasswordModal = ({ user, onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword({ id: user._id, newPassword }).unwrap();
      alert("Password reset ho gaya!");
      onClose();
    } catch (err) {
      alert(err?.data?.message || "Failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Reset Password</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X size={17} className="text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">{user.name}</span> ka password reset karo
          </p>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">New Password *</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              required minLength={6}
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition disabled:opacity-60 flex items-center justify-center gap-2">
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Delete Confirm ───────────────────────────────────────
const DeleteConfirm = ({ name, onClose, onConfirm, isLoading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <Trash2 size={24} className="text-red-500" />
        </div>
      </div>
      <h3 className="text-center text-lg font-semibold text-gray-800 mb-1">Delete User?</h3>
      <p className="text-center text-sm text-gray-500 mb-6">
        <span className="font-medium text-gray-700">"{name}"</span> permanently delete ho jayega.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={isLoading}
          className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-60 flex items-center justify-center gap-2">
          {isLoading && <Loader2 size={15} className="animate-spin" />}
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────
const UsersPage = () => {
  const [page,         setPage]         = useState(1);
  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState("");
  const [showModal,    setShowModal]    = useState(false);
  const [editData,     setEditData]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [resetTarget,  setResetTarget]  = useState(null);

  const { data, isLoading, isFetching } = useGetUsersQuery({ page, search, role: roleFilter });
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  const handleDelete = async () => {
    try {
      await deleteUser(deleteTarget._id).unwrap();
      setDeleteTarget(null);
    } catch (err) {
      alert(err?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage team members & roles</p>
        </div>
        <button
          onClick={() => { setEditData(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* Role Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: data?.total || 0,
            color: "bg-indigo-500", icon: Users },
          ...ROLES.map((r) => ({
            label: r.label + "s",
            value: data?.users?.filter((u) => u.role === r.id).length || 0,
            color: r.id === "admin" ? "bg-purple-500" : r.id === "manager" ? "bg-blue-500" : "bg-emerald-500",
            icon: r.icon,
          })),
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon size={18} className="text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Filters */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="flex gap-1.5">
            <button onClick={() => setRoleFilter("")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
                ${!roleFilter ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              All
            </button>
            {ROLES.map((r) => (
              <button key={r.id} onClick={() => setRoleFilter(roleFilter === r.id ? "" : r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize
                  ${roleFilter === r.id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {r.label}
              </button>
            ))}
          </div>
          {isFetching && <Loader2 size={16} className="animate-spin text-indigo-500" />}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3.5 text-left">#</th>
                <th className="px-5 py-3.5 text-left">User</th>
                <th className="px-5 py-3.5 text-left">Role</th>
                <th className="px-5 py-3.5 text-left">Joined</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-16 text-gray-400">
                  <Loader2 size={24} className="animate-spin mx-auto mb-2" /> Loading...
                </td></tr>
              ) : data?.users?.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-16 text-gray-400">
                  <Users size={36} className="mx-auto mb-2 opacity-20" /> No users found
                </td></tr>
              ) : (
                data?.users?.map((user, idx) => {
                  const roleInfo = getRoleInfo(user.role);
                  return (
                    <tr key={user._id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4 text-gray-400">{(page - 1) * 10 + idx + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center font-semibold text-indigo-600 text-sm flex-shrink-0">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>
                          <roleInfo.icon size={11} />
                          {roleInfo.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs">
                        {new Date(user.createdAt).toLocaleDateString("en-PK", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setResetTarget(user)}
                            title="Reset Password"
                            className="p-2 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-500 transition">
                            <KeyRound size={14} />
                          </button>
                          <button onClick={() => { setEditData(user); setShowModal(true); }}
                            className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => setDeleteTarget(user)}
                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {data?.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {data.page} of {data.pages} — {data.total} total
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setPage((p) => Math.min(data.pages, p + 1))} disabled={page === data.pages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal    && <UserModal onClose={() => setShowModal(false)} editData={editData} />}
      {deleteTarget && <DeleteConfirm name={deleteTarget.name} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} isLoading={deleting} />}
      {resetTarget  && <ResetPasswordModal user={resetTarget} onClose={() => setResetTarget(null)} />}
    </div>
  );
};

export default UsersPage;