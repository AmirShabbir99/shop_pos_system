import { useState } from "react";
import {
  useGetCustomersQuery, useGetCustomerQuery,
  useCreateCustomerMutation, useUpdateCustomerMutation,
  useDeleteCustomerMutation, useAddTransactionMutation,
} from "../../features/customer/customerApi";
import {
  Plus, Search, Edit2, Trash2, X, Loader2,
  Users, ChevronLeft, ChevronRight, Eye,
  Phone, Mail, MapPin, CreditCard,
  TrendingUp, TrendingDown, Wallet,
  CheckCircle, XCircle, ArrowUpRight, ArrowDownLeft,
} from "lucide-react";

// ─── Customer Form Modal ──────────────────────────────────
const CustomerModal = ({ onClose, editData }) => {
  const [form, setForm] = useState({
    name:    editData?.name    || "",
    phone:   editData?.phone   || "",
    email:   editData?.email   || "",
    address: editData?.address || "",
    cnic:    editData?.cnic    || "",
  });
  const [create, { isLoading: creating }] = useCreateCustomerMutation();
  const [update, { isLoading: updating }] = useUpdateCustomerMutation();
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
          <h2 className="font-semibold text-gray-800">{editData ? "Edit Customer" : "Add Customer"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={17} className="text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            { field: "name",    label: "Full Name *",    placeholder: "e.g. Ali Hassan",          icon: Users     },
            { field: "phone",   label: "Phone",          placeholder: "e.g. 03001234567",          icon: Phone     },
            { field: "email",   label: "Email",          placeholder: "e.g. ali@gmail.com",        icon: Mail      },
            { field: "address", label: "Address",        placeholder: "e.g. Lahore, Pakistan",     icon: MapPin    },
            { field: "cnic",    label: "CNIC",           placeholder: "e.g. 35201-1234567-1",      icon: CreditCard},
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
              {editData ? "Update" : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Transaction Modal (Khata) ────────────────────────────
const TransactionModal = ({ customer, onClose }) => {
  const [form, setForm] = useState({ type: "credit", amount: "", description: "" });
  const [addTransaction, { isLoading }] = useAddTransactionMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTransaction({ id: customer._id, ...form }).unwrap();
      onClose();
    } catch (err) { alert(err?.data?.message || "Error"); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-800">Khata Entry</h2>
            <p className="text-xs text-gray-400">{customer.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={17} className="text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type selector */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "credit",  label: "Udhaar Do",   color: "text-red-600",   bg: "bg-red-50",    border: "border-red-300",   icon: ArrowUpRight   },
                { id: "payment", label: "Payment Liya", color: "text-green-600", bg: "bg-green-50",  border: "border-green-300", icon: ArrowDownLeft  },
              ].map(({ id, label, color, bg, border, icon: Icon }) => (
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
              <input type="number" min="1"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Note</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional note..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Current balance */}
          <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${customer.balance > 0 ? "bg-red-50" : "bg-green-50"}`}>
            <span className="text-sm text-gray-600">Current Balance</span>
            <span className={`font-bold text-sm ${customer.balance > 0 ? "text-red-600" : "text-green-600"}`}>
              Rs. {Math.abs(customer.balance).toLocaleString()}
              {customer.balance > 0 ? " (Udhaar)" : " (Clear)"}
            </span>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={isLoading}
              className={`flex-1 py-2.5 rounded-xl text-white text-sm font-medium transition disabled:opacity-60 flex items-center justify-center gap-2
                ${form.type === "payment" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-500 hover:bg-red-600"}`}>
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Customer Detail Modal ────────────────────────────────
const CustomerDetailModal = ({ customerId, onClose }) => {
  const { data, isLoading } = useGetCustomerQuery(customerId);
  const customer = data?.customer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-semibold text-gray-800">Customer Khata</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={17} className="text-gray-500" /></button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-indigo-500" /></div>
        ) : customer ? (
          <div className="p-6 space-y-4">
            {/* Customer info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                {customer.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-lg">{customer.name}</p>
                <p className="text-sm text-gray-400">{customer.phone}</p>
              </div>
              <div className={`ml-auto text-right px-4 py-2 rounded-xl ${customer.balance > 0 ? "bg-red-50" : "bg-green-50"}`}>
                <p className="text-xs text-gray-500 mb-0.5">Balance</p>
                <p className={`font-bold text-lg ${customer.balance > 0 ? "text-red-600" : "text-green-600"}`}>
                  Rs. {Math.abs(customer.balance).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">{customer.balance > 0 ? "Udhaar" : "Clear"}</p>
              </div>
            </div>

            {/* Transactions */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-3">Transaction History</p>
              {customer.transactions?.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-6">Koi transaction nahi</p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {[...customer.transactions].reverse().map((tx, i) => (
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
                        {tx.type === "payment" ? "+" : "-"} Rs. {tx.amount.toLocaleString()}
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

// ─── Delete Confirm ───────────────────────────────────────
const DeleteConfirm = ({ name, onClose, onConfirm, isLoading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <Trash2 size={24} className="text-red-500" />
        </div>
      </div>
      <h3 className="text-center text-lg font-semibold text-gray-800 mb-1">Delete Customer?</h3>
      <p className="text-center text-sm text-gray-500 mb-6">
        <span className="font-medium text-gray-700">"{name}"</span> ka record permanently delete ho jayega.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Cancel</button>
        <button onClick={onConfirm} disabled={isLoading}
          className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-60 flex items-center justify-center gap-2">
          {isLoading && <Loader2 size={15} className="animate-spin" />} Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Customer Card ────────────────────────────────────────
const CustomerCard = ({ customer, onEdit, onDelete, onKhata, onView }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg flex-shrink-0">
          {customer.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{customer.name}</p>
          <p className="text-xs text-gray-400">{customer.phone || "No phone"}</p>
        </div>
      </div>
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium
        ${customer.status === "active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
        {customer.status}
      </span>
    </div>

    {/* Balance */}
    <div className={`rounded-xl px-4 py-3 mb-4 flex items-center justify-between
      ${customer.balance > 0 ? "bg-red-50" : customer.balance < 0 ? "bg-green-50" : "bg-gray-50"}`}>
      <div className="flex items-center gap-2">
        <Wallet size={14} className={customer.balance > 0 ? "text-red-500" : "text-green-500"} />
        <span className="text-xs text-gray-600">
          {customer.balance > 0 ? "Udhaar Baqi" : customer.balance < 0 ? "Advance" : "Clear"}
        </span>
      </div>
      <span className={`font-bold text-sm ${customer.balance > 0 ? "text-red-600" : customer.balance < 0 ? "text-green-600" : "text-gray-500"}`}>
        Rs. {Math.abs(customer.balance).toLocaleString()}
      </span>
    </div>

    {/* Info */}
    {customer.address && (
      <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-3 truncate">
        <MapPin size={11} /> {customer.address}
      </p>
    )}

    {/* Actions */}
    <div className="flex gap-2">
      <button onClick={() => onKhata(customer)}
        className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-1.5">
        <Wallet size={13} /> Khata
      </button>
      <button onClick={() => onView(customer._id)}
        className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-gray-500 hover:text-indigo-600">
        <Eye size={15} />
      </button>
      <button onClick={() => onEdit(customer)}
        className="p-2 rounded-xl border border-gray-200 hover:bg-indigo-50 transition text-gray-500 hover:text-indigo-600">
        <Edit2 size={15} />
      </button>
      <button onClick={() => onDelete(customer)}
        className="p-2 rounded-xl border border-gray-200 hover:bg-red-50 transition text-gray-500 hover:text-red-500">
        <Trash2 size={15} />
      </button>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────
const CustomersPage = () => {
  const [page,         setPage]         = useState(1);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal,    setShowModal]    = useState(false);
  const [editData,     setEditData]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [khataTarget,  setKhataTarget]  = useState(null);
  const [viewId,       setViewId]       = useState(null);

  const { data, isLoading, isFetching } = useGetCustomersQuery({ page, search, status: statusFilter });
  const [deleteCustomer, { isLoading: deleting }] = useDeleteCustomerMutation();

  const handleDelete = async () => {
    try {
      await deleteCustomer(deleteTarget._id).unwrap();
      setDeleteTarget(null);
    } catch (err) { alert(err?.data?.message || "Delete failed"); }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-sm text-gray-500 mt-0.5">Customer profiles & khata management</p>
        </div>
        <button onClick={() => { setEditData(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm">
          <Plus size={16} /> Add Customer
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: data?.summary?.totalCustomers || 0,                                   color: "bg-indigo-500",  icon: Users       },
          { label: "Udhaar Wale",     value: data?.summary?.withUdhaar     || 0,                                   color: "bg-red-500",     icon: TrendingUp  },
          { label: "Total Udhaar",    value: `Rs. ${(data?.summary?.totalUdhaar || 0).toLocaleString()}`,          color: "bg-amber-500",   icon: Wallet      },
          { label: "Active",          value: data?.customers?.filter(c => c.status === "active").length || 0,     color: "bg-emerald-500", icon: CheckCircle },
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

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or phone..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
        </div>
        <div className="flex gap-1.5">
          {[{ id: "", label: "All" }, { id: "active", label: "Active" }, { id: "inactive", label: "Inactive" }].map((f) => (
            <button key={f.id} onClick={() => { setStatusFilter(f.id); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
                ${statusFilter === f.id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {f.label}
            </button>
          ))}
        </div>
        {isFetching && <Loader2 size={16} className="animate-spin text-indigo-500" />}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-indigo-500" /></div>
      ) : data?.customers?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users size={40} className="mx-auto mb-2 opacity-20" />
          <p>No customers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.customers?.map((c) => (
            <CustomerCard key={c._id} customer={c}
              onEdit={(c)  => { setEditData(c); setShowModal(true); }}
              onDelete={setDeleteTarget}
              onKhata={setKhataTarget}
              onView={setViewId}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data?.pages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3">
          <p className="text-sm text-gray-500">Page {data.page} of {data.pages}</p>
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

      {/* Modals */}
      {showModal    && <CustomerModal       onClose={() => setShowModal(false)} editData={editData} />}
      {deleteTarget && <DeleteConfirm       name={deleteTarget.name} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} isLoading={deleting} />}
      {khataTarget  && <TransactionModal    customer={khataTarget}   onClose={() => setKhataTarget(null)} />}
      {viewId       && <CustomerDetailModal customerId={viewId}      onClose={() => setViewId(null)} />}
    </div>
  );
};

export default CustomersPage;