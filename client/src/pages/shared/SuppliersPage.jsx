import { useState } from "react";
import {
  useGetSuppliersQuery, useGetSupplierQuery,
  useCreateSupplierMutation, useUpdateSupplierMutation,
  useDeleteSupplierMutation, useAddSupplierTransactionMutation,
} from "../../features/supplier/supplierApi";
import {
  Plus, Search, Edit2, Trash2, X, Loader2,
  Truck, ChevronLeft, ChevronRight, Eye,
  Phone, Mail, MapPin, Building2,
  Wallet, ArrowUpRight, ArrowDownLeft,
} from "lucide-react";

// ─── Supplier Modal ───────────────────────────────────────
const SupplierModal = ({ onClose, editData }) => {
  const [form, setForm] = useState({
    name:    editData?.name    || "",
    company: editData?.company || "",
    phone:   editData?.phone   || "",
    email:   editData?.email   || "",
    address: editData?.address || "",
  });
  const [create, { isLoading: creating }] = useCreateSupplierMutation();
  const [update, { isLoading: updating }] = useUpdateSupplierMutation();
  const isLoading = creating || updating;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      editData
        ? await update({ id: editData._id, ...form }).unwrap()
        : await create(form).unwrap();
      onClose();
    } catch (err) { alert(err?.data?.message || "Error"); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">{editData ? "Edit Supplier" : "Add Supplier"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={17} className="text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            { field: "name",    label: "Contact Name *", placeholder: "e.g. Usman Sheikh",     icon: Truck    },
            { field: "company", label: "Company Name",   placeholder: "e.g. Usman Traders",    icon: Building2},
            { field: "phone",   label: "Phone",          placeholder: "e.g. 03001234567",       icon: Phone    },
            { field: "email",   label: "Email",          placeholder: "e.g. usman@traders.com", icon: Mail     },
            { field: "address", label: "Address",        placeholder: "e.g. Lahore, Pakistan",  icon: MapPin   },
          ].map(({ field, label, placeholder, icon: Icon }) => (
            <div key={field}>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</label>
              <div className="relative">
                <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  placeholder={placeholder}
                  required={field === "name"}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
          ))}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              {editData ? "Update" : "Add Supplier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Payment Modal ────────────────────────────────────────
const PaymentModal = ({ supplier, onClose }) => {
  const [form, setForm] = useState({ type: "purchase", amount: "", description: "" });
  const [addTransaction, { isLoading }] = useAddSupplierTransactionMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTransaction({ id: supplier._id, ...form }).unwrap();
      onClose();
    } catch (err) { alert(err?.data?.message || "Error"); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-800">Ledger Entry</h2>
            <p className="text-xs text-gray-400">{supplier.name} · {supplier.company}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={17} className="text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "purchase", label: "Maal Aya",    icon: ArrowUpRight,  color: "text-red-600",   bg: "bg-red-50",   border: "border-red-300"   },
                { id: "payment",  label: "Payment Diya", icon: ArrowDownLeft, color: "text-green-600", bg: "bg-green-50", border: "border-green-300" },
              ].map(({ id, label, icon: Icon, color, bg, border }) => (
                <button key={id} type="button"
                  onClick={() => setForm({ ...form, type: id })}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition font-medium text-sm
                    ${form.type === id ? `${bg} ${border} ${color}` : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Amount *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rs.</span>
              <input type="number" min="1" value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Note</label>
            <input value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. Invoice #123"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
          </div>

          <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${supplier.balance > 0 ? "bg-red-50" : "bg-green-50"}`}>
            <span className="text-sm text-gray-600">Current Payable</span>
            <span className={`font-bold text-sm ${supplier.balance > 0 ? "text-red-600" : "text-green-600"}`}>
              Rs. {Math.abs(supplier.balance).toLocaleString()}
              {supplier.balance > 0 ? " (Baqi hai)" : " (Clear)"}
            </span>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={isLoading}
              className={`flex-1 py-2.5 rounded-xl text-white text-sm font-medium transition disabled:opacity-60 flex items-center justify-center gap-2
                ${form.type === "payment" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-500 hover:bg-red-600"}`}>
              {isLoading && <Loader2 size={15} className="animate-spin" />} Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Supplier Detail Modal ────────────────────────────────
const SupplierDetailModal = ({ supplierId, onClose }) => {
  const { data, isLoading } = useGetSupplierQuery(supplierId);
  const supplier = data?.supplier;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-semibold text-gray-800">Supplier Ledger</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={17} className="text-gray-500" /></button>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-indigo-500" /></div>
        ) : supplier ? (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl font-bold">
                {supplier.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-lg">{supplier.name}</p>
                <p className="text-sm text-gray-400">{supplier.company} · {supplier.phone}</p>
              </div>
              <div className={`ml-auto text-right px-4 py-2 rounded-xl ${supplier.balance > 0 ? "bg-red-50" : "bg-green-50"}`}>
                <p className="text-xs text-gray-500 mb-0.5">Payable</p>
                <p className={`font-bold text-lg ${supplier.balance > 0 ? "text-red-600" : "text-green-600"}`}>
                  Rs. {Math.abs(supplier.balance).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">{supplier.balance > 0 ? "Baqi" : "Clear"}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-3">Transaction History</p>
              {supplier.transactions?.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-6">Koi transaction nahi</p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {[...supplier.transactions].reverse().map((tx, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                          ${tx.type === "payment" ? "bg-green-100" : "bg-red-100"}`}>
                          {tx.type === "payment"
                            ? <ArrowDownLeft size={14} className="text-green-600" />
                            : <ArrowUpRight  size={14} className="text-red-500" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 capitalize">{tx.type}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(tx.date).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                            {tx.description ? ` · ${tx.description}` : ""}
                          </p>
                        </div>
                      </div>
                      <span className={`font-semibold text-sm ${tx.type === "payment" ? "text-green-600" : "text-red-500"}`}>
                        {tx.type === "payment" ? "-" : "+"} Rs. {tx.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ─── Supplier Card ────────────────────────────────────────
const SupplierCard = ({ supplier, onEdit, onDelete, onLedger, onView }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg flex-shrink-0">
          {supplier.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{supplier.name}</p>
          <p className="text-xs text-gray-400">{supplier.company || "No company"}</p>
        </div>
      </div>
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium
        ${supplier.status === "active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
        {supplier.status}
      </span>
    </div>

    {/* Payable Balance */}
    <div className={`rounded-xl px-4 py-3 mb-4 flex items-center justify-between
      ${supplier.balance > 0 ? "bg-red-50" : "bg-green-50"}`}>
      <div className="flex items-center gap-2">
        <Wallet size={14} className={supplier.balance > 0 ? "text-red-500" : "text-green-500"} />
        <span className="text-xs text-gray-600">
          {supplier.balance > 0 ? "Dena Baqi" : "Clear"}
        </span>
      </div>
      <span className={`font-bold text-sm ${supplier.balance > 0 ? "text-red-600" : "text-green-600"}`}>
        Rs. {Math.abs(supplier.balance).toLocaleString()}
      </span>
    </div>

    {supplier.phone && (
      <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-3">
        <Phone size={11} /> {supplier.phone}
      </p>
    )}

    {/* Actions */}
    <div className="flex gap-2">
      <button onClick={() => onLedger(supplier)}
        className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition flex items-center justify-center gap-1.5">
        <Wallet size={13} /> Ledger
      </button>
      <button onClick={() => onView(supplier._id)}
        className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-gray-500 hover:text-indigo-600">
        <Eye size={15} />
      </button>
      <button onClick={() => onEdit(supplier)}
        className="p-2 rounded-xl border border-gray-200 hover:bg-indigo-50 transition text-gray-500 hover:text-indigo-600">
        <Edit2 size={15} />
      </button>
      <button onClick={() => onDelete(supplier)}
        className="p-2 rounded-xl border border-gray-200 hover:bg-red-50 transition text-gray-500 hover:text-red-500">
        <Trash2 size={15} />
      </button>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────
const SuppliersPage = () => {
  const [page,         setPage]         = useState(1);
  const [search,       setSearch]       = useState("");
  const [showModal,    setShowModal]    = useState(false);
  const [editData,     setEditData]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [ledgerTarget, setLedgerTarget] = useState(null);
  const [viewId,       setViewId]       = useState(null);

  const { data, isLoading, isFetching } = useGetSuppliersQuery({ page, search });
  const [deleteSupplier, { isLoading: deleting }] = useDeleteSupplierMutation();

  const handleDelete = async () => {
    try {
      await deleteSupplier(deleteTarget._id).unwrap();
      setDeleteTarget(null);
    } catch (err) { alert(err?.data?.message || "Delete failed"); }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
          <p className="text-sm text-gray-500 mt-0.5">Supplier management & payables</p>
        </div>
        <button onClick={() => { setEditData(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition shadow-sm">
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Suppliers", value: data?.summary?.totalSuppliers || 0,                                 color: "bg-emerald-500", icon: Truck  },
          { label: "Payable Wale",    value: data?.summary?.withPayable    || 0,                                 color: "bg-red-500",     icon: Wallet },
          { label: "Total Payable",   value: `Rs. ${(data?.summary?.totalPayable || 0).toLocaleString()}`,       color: "bg-amber-500",   icon: ArrowUpRight },
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

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or company..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
        </div>
        {isFetching && <Loader2 size={16} className="animate-spin text-indigo-500" />}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-indigo-500" /></div>
      ) : data?.suppliers?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Truck size={40} className="mx-auto mb-2 opacity-20" />
          <p>No suppliers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.suppliers?.map((s) => (
            <SupplierCard key={s._id} supplier={s}
              onEdit={(s)   => { setEditData(s); setShowModal(true); }}
              onDelete={setDeleteTarget}
              onLedger={setLedgerTarget}
              onView={setViewId}
            />
          ))}
        </div>
      )}

      {data?.pages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3">
          <p className="text-sm text-gray-500">Page {data.page} of {data.pages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"><ChevronLeft size={16} /></button>
            <button onClick={() => setPage((p) => Math.min(data.pages, p + 1))} disabled={page === data.pages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      {showModal    && <SupplierModal       onClose={() => setShowModal(false)} editData={editData} />}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center"><Trash2 size={24} className="text-red-500" /></div>
            </div>
            <h3 className="text-center text-lg font-semibold text-gray-800 mb-1">Delete Supplier?</h3>
            <p className="text-center text-sm text-gray-500 mb-6">
              <span className="font-medium text-gray-700">"{deleteTarget.name}"</span> permanently delete ho jayega.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-60 flex items-center justify-center gap-2">
                {deleting && <Loader2 size={15} className="animate-spin" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {ledgerTarget && <PaymentModal        supplier={ledgerTarget} onClose={() => setLedgerTarget(null)} />}
      {viewId       && <SupplierDetailModal supplierId={viewId}     onClose={() => setViewId(null)} />}
    </div>
  );
};

export default SuppliersPage;