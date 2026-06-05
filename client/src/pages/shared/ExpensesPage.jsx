import { useState } from "react";
import {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} from "../../features/expense/expenseApi";
import {
  Plus, Search, Edit2, Trash2, X,
  Loader2, Wallet, ChevronLeft, ChevronRight,
  Home, Zap, Users, Package, Wrench, MoreHorizontal,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

const CATEGORIES = [
  { id: "rent",        label: "Rent",        icon: Home,          color: "bg-indigo-50 text-indigo-600" },
  { id: "electricity", label: "Electricity", icon: Zap,           color: "bg-amber-50 text-amber-600"  },
  { id: "salary",      label: "Salary",      icon: Users,         color: "bg-emerald-50 text-emerald-600" },
  { id: "inventory",   label: "Inventory",   icon: Package,       color: "bg-blue-50 text-blue-600"   },
  { id: "maintenance", label: "Maintenance", icon: Wrench,        color: "bg-orange-50 text-orange-600" },
  { id: "other",       label: "Other",       icon: MoreHorizontal,color: "bg-gray-50 text-gray-600"   },
];

const getCatInfo = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[5];

// ─── Expense Modal ────────────────────────────────────────
const ExpenseModal = ({ onClose, editData }) => {
  const [form, setForm] = useState({
    title:       editData?.title       || "",
    amount:      editData?.amount      || "",
    category:    editData?.category    || "other",
    description: editData?.description || "",
    date:        editData?.date
      ? new Date(editData.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  });

  const [create, { isLoading: creating }] = useCreateExpenseMutation();
  const [update, { isLoading: updating }] = useUpdateExpenseMutation();
  const isLoading = creating || updating;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        await update({ id: editData._id, ...form }).unwrap();
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
            {editData ? "Edit Expense" : "Add Expense"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <X size={17} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Monthly Rent"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rs.</span>
                <input
                  type="number" min="0"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(({ id, label, icon: Icon, color }) => (
                <button key={id} type="button"
                  onClick={() => setForm({ ...form, category: id })}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition text-xs font-medium
                    ${form.category === id
                      ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                    }`}>
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional note..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              {editData ? "Update" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Delete Confirm ───────────────────────────────────────
const DeleteConfirm = ({ onClose, onConfirm, isLoading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <Trash2 size={24} className="text-red-500" />
        </div>
      </div>
      <h3 className="text-center text-lg font-semibold text-gray-800 mb-1">Delete Expense?</h3>
      <p className="text-center text-sm text-gray-500 mb-6">Yeh record permanently delete ho jayega.</p>
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
const ExpensesPage = () => {
  const [page,         setPage]         = useState(1);
  const [search,       setSearch]       = useState("");
  const [catFilter,    setCatFilter]    = useState("");
  const [showModal,    setShowModal]    = useState(false);
  const [editData,     setEditData]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isFetching } = useGetExpensesQuery({
    page, search, category: catFilter,
  });
  const [deleteExpense, { isLoading: deleting }] = useDeleteExpenseMutation();

  const handleDelete = async () => {
    try {
      await deleteExpense(deleteTarget._id).unwrap();
      setDeleteTarget(null);
    } catch (err) {
      alert(err?.data?.message || "Delete failed");
    }
  };

  const pieData = data?.summary?.map((s) => ({
    name:  getCatInfo(s._id).label,
    value: s.total,
  })) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track all business expenses</p>
        </div>
        <button
          onClick={() => { setEditData(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
        >
          <Plus size={16} /> Add Expense
        </button>
      </div>

      {/* Stats + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Category cards */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3">
          {CATEGORIES.map(({ id, label, icon: Icon, color }) => {
            const catData = data?.summary?.find((s) => s._id === id);
            return (
              <div key={id}
                onClick={() => setCatFilter(catFilter === id ? "" : id)}
                className={`bg-white rounded-2xl border shadow-sm p-4 cursor-pointer transition-all
                  ${catFilter === id ? "border-indigo-400 ring-2 ring-indigo-100" : "border-gray-100 hover:border-gray-200"}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                  <Icon size={16} />
                </div>
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="text-lg font-bold text-gray-800">
                  Rs. {(catData?.total || 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">{catData?.count || 0} entries</p>
              </div>
            );
          })}
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-1">Total Expenses</h2>
          <p className="text-2xl font-bold text-red-500 mb-3">
            Rs. {(data?.totalAmount || 0).toLocaleString()}
          </p>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `Rs. ${v.toLocaleString()}`}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "12px" }} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search expenses..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          {catFilter && (
            <button onClick={() => setCatFilter("")}
              className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-3 py-2 rounded-xl">
              {getCatInfo(catFilter).label} <X size={12} />
            </button>
          )}
          {isFetching && <Loader2 size={16} className="animate-spin text-indigo-500" />}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3.5 text-left">Title</th>
                <th className="px-5 py-3.5 text-left">Category</th>
                <th className="px-5 py-3.5 text-left">Description</th>
                <th className="px-5 py-3.5 text-left">Date</th>
                <th className="px-5 py-3.5 text-left">Added By</th>
                <th className="px-5 py-3.5 text-right">Amount</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2" /> Loading...
                  </td>
                </tr>
              ) : data?.expenses?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    <Wallet size={36} className="mx-auto mb-2 opacity-20" />
                    No expenses found
                  </td>
                </tr>
              ) : (
                data?.expenses?.map((exp) => {
                  const cat = getCatInfo(exp.category);
                  return (
                    <tr key={exp._id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4 font-medium text-gray-800">{exp.title}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cat.color}`}>
                          <cat.icon size={11} /> {cat.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 max-w-xs truncate">
                        {exp.description || "—"}
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        {new Date(exp.date).toLocaleDateString("en-PK", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4 text-gray-500">{exp.createdBy?.name || "—"}</td>
                      <td className="px-5 py-4 text-right font-bold text-red-500">
                        Rs. {exp.amount.toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setEditData(exp); setShowModal(true); }}
                            className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => setDeleteTarget(exp)}
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

      {showModal && (
        <ExpenseModal onClose={() => setShowModal(false)} editData={editData} />
      )}
      {deleteTarget && (
        <DeleteConfirm
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          isLoading={deleting}
        />
      )}
    </div>
  );
};

export default ExpensesPage;