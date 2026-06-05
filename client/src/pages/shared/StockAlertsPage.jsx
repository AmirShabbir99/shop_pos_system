import { useLowStock } from "../../hooks/useLowStock";
import { AlertTriangle, Package, XCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StockAlertsPage = () => {
  const { lowStockProducts, outOfStock } = useLowStock();
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Stock Alerts</h1>
        <p className="text-sm text-gray-500 mt-0.5">Products jinhe restock karna hai</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
            <AlertTriangle size={22} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-amber-600 mb-0.5">Low Stock</p>
            <p className="text-3xl font-bold text-amber-700">{lowStockProducts.length}</p>
            <p className="text-xs text-amber-500">Products</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <XCircle size={22} className="text-red-600" />
          </div>
          <div>
            <p className="text-xs text-red-600 mb-0.5">Out of Stock</p>
            <p className="text-3xl font-bold text-red-700">{outOfStock.length}</p>
            <p className="text-xs text-red-500">Products</p>
          </div>
        </div>
      </div>

      {/* Out of Stock */}
      {outOfStock.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <XCircle size={16} className="text-red-500" /> Out of Stock
            </h2>
            <span className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-medium">
              {outOfStock.length} items
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {outOfStock.map((p) => (
              <div key={p._id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  {p.image?.url ? (
                    <img src={p.image.url} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                      <Package size={16} className="text-red-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.category?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                    0 {p.unit}
                  </span>
                  <button
                    onClick={() => navigate("/admin/products")}
                    className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Stock */}
      {lowStockProducts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" /> Low Stock
            </h2>
            <span className="text-xs bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full font-medium">
              {lowStockProducts.length} items
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {lowStockProducts.map((p) => {
              const pct = Math.round((p.stock / p.lowStockAlert) * 100);
              return (
                <div key={p._id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {p.image?.url ? (
                      <img src={p.image.url} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <Package size={16} className="text-amber-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full max-w-32">
                          <div
                            className="h-1.5 bg-amber-400 rounded-full transition-all"
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">
                          {p.stock}/{p.lowStockAlert} {p.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-medium">
                      {p.stock} left
                    </span>
                    <button
                      onClick={() => navigate("/admin/products")}
                      className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All good */}
      {outOfStock.length === 0 && lowStockProducts.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={28} className="text-green-400" />
          </div>
          <p className="font-medium text-gray-600">Sab stock levels theek hain!</p>
          <p className="text-sm mt-1">Koi alert nahi hai 🎉</p>
        </div>
      )}
    </div>
  );
};

export default StockAlertsPage;