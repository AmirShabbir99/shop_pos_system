import { useState } from "react";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../features/product/productApi";
import { useGetCategoriesQuery } from "../../features/category/categoryApi";
import {
  Plus, Search, Edit2, Trash2, X, Loader2,
  Package, ChevronLeft, ChevronRight, Eye,
  CheckCircle, XCircle, AlertTriangle, Upload,
} from "lucide-react";

// ─── Stock Badge ──────────────────────────────────────────
const StockBadge = ({ stock, low }) => {
  if (stock === 0)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
        <XCircle size={11} /> Out of Stock
      </span>
    );
  if (stock <= low)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
        <AlertTriangle size={11} /> Low Stock
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
      <CheckCircle size={11} /> In Stock
    </span>
  );
};

// ─── Product Modal ────────────────────────────────────────
const ProductModal = ({ onClose, editData }) => {
  const { data: catData } = useGetCategoriesQuery({ limit: 100 });
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const isLoading = creating || updating;

  const [form, setForm] = useState({
    name: editData?.name || "",
    barcode: editData?.barcode || "",
    category: editData?.category?._id || "",
    purchasePrice: editData?.purchasePrice || "",
    salePrice: editData?.salePrice || "",
    stock: editData?.stock || "",
    lowStockAlert: editData?.lowStockAlert || 10,
    unit: editData?.unit || "pcs",
    status: editData?.status || "active",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(editData?.image?.url || "");

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);

      if (editData) {
        await updateProduct({ id: editData._id, formData: fd }).unwrap();
      } else {
        await createProduct(fd).unwrap();
      }
      onClose();
    } catch (err) {
      alert(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-800">
            {editData ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Image Upload */}
          <div className="flex justify-center">
            <label className="cursor-pointer group">
              <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-200 group-hover:border-indigo-400 transition flex items-center justify-center overflow-hidden bg-gray-50">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <Upload size={22} />
                    <span className="text-xs">Upload</span>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
          </div>

          {/* Name + Barcode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Product Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Pepsi 500ml"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Barcode</label>
              <input
                value={form.barcode}
                onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                placeholder="e.g. 123456789"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Category + Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
              >
                <option value="">Select category</option>
                {catData?.categories?.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Unit</label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                {["pcs", "kg", "g", "liter", "ml", "box", "dozen"].map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Purchase Price *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rs.</span>
                <input
                  type="number" min="0"
                  value={form.purchasePrice}
                  onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Sale Price *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rs.</span>
                <input
                  type="number" min="0"
                  value={form.salePrice}
                  onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Stock Quantity</label>
              <input
                type="number" min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Low Stock Alert</label>
              <input
                type="number" min="0"
                value={form.lowStockAlert}
                onChange={(e) => setForm({ ...form, lowStockAlert: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Status</label>
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
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              {editData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Detail Modal ─────────────────────────────────────────
const DetailModal = ({ product, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Product Details</h2>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
          <X size={18} className="text-gray-500" />
        </button>
      </div>
      <div className="p-6">
        <div className="flex gap-4 mb-5">
          {product.image?.url ? (
            <img src={product.image.url} alt={product.name}
              className="w-20 h-20 rounded-xl object-cover border border-gray-100" />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Package size={28} className="text-indigo-400" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category?.name}</p>
            <StockBadge stock={product.stock} low={product.lowStockAlert} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            ["Barcode", product.barcode || "—"],
            ["Unit", product.unit],
            ["Purchase Price", `Rs. ${product.purchasePrice}`],
            ["Sale Price", `Rs. ${product.salePrice}`],
            ["Stock", `${product.stock} ${product.unit}`],
            ["Low Stock Alert", product.lowStockAlert],
            ["Status", product.status],
            ["Profit/Unit", `Rs. ${product.salePrice - product.purchasePrice}`],
          ].map(([label, value]) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>
              <p className="font-medium text-gray-700 capitalize">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── Delete Confirm ───────────────────────────────────────
const DeleteConfirm = ({ onClose, onConfirm, name, isLoading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <Trash2 size={24} className="text-red-500" />
        </div>
      </div>
      <h3 className="text-center text-lg font-semibold text-gray-800 mb-1">Delete Product?</h3>
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

// ─── Product Card (McDonald's Grid Style) ─────────────────
const ProductCard = ({ product, onEdit, onDelete, onView }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group">
    <div className="relative">
      {product.image?.url ? (
        <img src={product.image.url} alt={product.name}
          className="w-full h-36 object-cover" />
      ) : (
        <div className="w-full h-36 bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
          <Package size={36} className="text-indigo-300" />
        </div>
      )}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
        <button onClick={() => onView(product)}
          className="p-1.5 bg-white rounded-lg shadow text-gray-500 hover:text-indigo-600 transition">
          <Eye size={13} />
        </button>
        <button onClick={() => onEdit(product)}
          className="p-1.5 bg-white rounded-lg shadow text-gray-500 hover:text-indigo-600 transition">
          <Edit2 size={13} />
        </button>
        <button onClick={() => onDelete(product)}
          className="p-1.5 bg-white rounded-lg shadow text-gray-500 hover:text-red-500 transition">
          <Trash2 size={13} />
        </button>
      </div>
      {product.status === "inactive" && (
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 bg-gray-800/70 text-white text-xs rounded-full">Inactive</span>
        </div>
      )}
    </div>
    <div className="p-3">
      <p className="font-semibold text-gray-800 text-sm truncate">{product.name}</p>
      <p className="text-xs text-gray-400 mb-2">{product.category?.name}</p>
      <div className="flex items-center justify-between">
        <span className="text-indigo-600 font-bold text-sm">Rs. {product.salePrice}</span>
        <StockBadge stock={product.stock} low={product.lowStockAlert} />
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────
const ProductPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [catFilter, setCatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid | table
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const { data, isLoading, isFetching } = useGetProductsQuery({
    search, page, category: catFilter, status: statusFilter,
  });
  const { data: catData } = useGetCategoriesQuery({ limit: 100 });
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteTarget._id).unwrap();
      setDeleteTarget(null);
    } catch (err) {
      alert(err?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your inventory</p>
        </div>
        <button
          onClick={() => { setEditData(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Products", value: data?.total || 0, color: "text-indigo-600" },
          { label: "In Stock", value: data?.products?.filter(p => p.stock > p.lowStockAlert).length || 0, color: "text-green-600" },
          { label: "Low Stock", value: data?.products?.filter(p => p.stock > 0 && p.stock <= p.lowStockAlert).length || 0, color: "text-amber-600" },
          { label: "Out of Stock", value: data?.products?.filter(p => p.stock === 0).length || 0, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <option value="">All Categories</option>
          {catData?.categories?.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {isFetching && <Loader2 size={16} className="animate-spin text-indigo-500" />}

        {/* Grid / Table toggle */}
        <div className="ml-auto flex gap-1 bg-gray-100 rounded-xl p-1">
          {["grid", "table"].map((m) => (
            <button key={m} onClick={() => setViewMode(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize ${viewMode === m ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-indigo-500" />
          </div>
        ) : data?.products?.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Package size={40} className="mx-auto mb-2 opacity-30" />
            <p>No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {data?.products?.map((p) => (
              <ProductCard key={p._id} product={p}
                onEdit={(p) => { setEditData(p); setShowModal(true); }}
                onDelete={setDeleteTarget}
                onView={setViewTarget}
              />
            ))}
          </div>
        )
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Purchase</th>
                  <th className="px-4 py-3 text-left">Sale</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">
                    <Loader2 size={24} className="animate-spin mx-auto" />
                  </td></tr>
                ) : data?.products?.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image?.url ? (
                          <img src={p.image.url} alt={p.name} className="w-9 h-9 rounded-lg object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <Package size={16} className="text-indigo-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.barcode || "No barcode"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.category?.name}</td>
                    <td className="px-4 py-3 text-gray-600">Rs. {p.purchasePrice}</td>
                    <td className="px-4 py-3 font-medium text-indigo-600">Rs. {p.salePrice}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">{p.stock} {p.unit}</span>
                        <StockBadge stock={p.stock} low={p.lowStockAlert} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {p.status === "active" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          <CheckCircle size={11} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                          <XCircle size={11} /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewTarget(p)}
                          className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => { setEditData(p); setShowModal(true); }}
                          className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteTarget(p)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
      )}

      {/* Modals */}
      {showModal && (
        <ProductModal onClose={() => setShowModal(false)} editData={editData} />
      )}
      {deleteTarget && (
        <DeleteConfirm
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          name={deleteTarget.name}
          isLoading={deleting}
        />
      )}
      {viewTarget && (
        <DetailModal product={viewTarget} onClose={() => setViewTarget(null)} />
      )}
    </div>
  );
};

export default ProductPage;