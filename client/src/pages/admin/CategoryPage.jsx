import { useState } from "react";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../features/category/categoryApi";
import {
  Plus, Search, Edit2, Trash2, X,
  Tag, CheckCircle, XCircle, Loader2,
  ChevronLeft, ChevronRight,
} from "lucide-react";

// ─── Modal ────────────────────────────────────────────────
const CategoryModal = ({ onClose, editData }) => {
  const [form, setForm] = useState({
    name: editData?.name || "",
    description: editData?.description || "",
    status: editData?.status || "active",
  });

  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
  const isLoading = creating || updating;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        await updateCategory({ id: editData._id, ...form }).unwrap();
      } else {
        await createCategory(form).unwrap();
      }
      onClose();
    } catch (err) {
      alert(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {editData ? "Edit Category" : "Add Category"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Category Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Beverages"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional description..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              {editData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Delete Confirm ───────────────────────────────────────
const DeleteConfirm = ({ onClose, onConfirm, name, isLoading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <Trash2 size={24} className="text-red-500" />
        </div>
      </div>
      <h3 className="text-center text-lg font-semibold text-gray-800 mb-1">
        Delete Category?
      </h3>
      <p className="text-center text-sm text-gray-500 mb-6">
        <span className="font-medium text-gray-700">"{name}"</span> permanently delete ho jayegi.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 size={15} className="animate-spin" />}
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────
const CategoryPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isFetching } = useGetCategoriesQuery({ search, page });
  const [deleteCategory, { isLoading: deleting }] = useDeleteCategoryMutation();

  const handleDelete = async () => {
    try {
      await deleteCategory(deleteTarget._id).unwrap();
      setDeleteTarget(null);
    } catch (err) {
      alert(err?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your product categories
          </p>
        </div>
        <button
          onClick={() => { setEditData(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: data?.total || 0, color: "bg-indigo-50 text-indigo-600" },
          { label: "Active", value: data?.categories?.filter(c => c.status === "active").length || 0, color: "bg-green-50 text-green-600" },
          { label: "Inactive", value: data?.categories?.filter(c => c.status === "inactive").length || 0, color: "bg-red-50 text-red-600" },
          { label: "This Page", value: data?.categories?.length || 0, color: "bg-amber-50 text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color.split(" ")[1]}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Search */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search categories..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          {isFetching && <Loader2 size={16} className="animate-spin text-indigo-500" />}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Created</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                    Loading...
                  </td>
                </tr>
              ) : data?.categories?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">
                    <Tag size={32} className="mx-auto mb-2 opacity-30" />
                    No categories found
                  </td>
                </tr>
              ) : (
                data?.categories?.map((cat, idx) => (
                  <tr key={cat._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-400">
                      {(page - 1) * 10 + idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                          <Tag size={14} className="text-indigo-500" />
                        </div>
                        <span className="font-medium text-gray-800">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                      {cat.description || "—"}
                    </td>
                    <td className="px-6 py-4">
                      {cat.status === "active" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          <CheckCircle size={12} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                          <XCircle size={12} /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(cat.createdAt).toLocaleDateString("en-PK", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditData(cat); setShowModal(true); }}
                          className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {data.page} of {data.pages} — {data.total} total
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                disabled={page === data.pages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <CategoryModal
          onClose={() => setShowModal(false)}
          editData={editData}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          name={deleteTarget.name}
          isLoading={deleting}
        />
      )}
    </div>
  );
};

export default CategoryPage;