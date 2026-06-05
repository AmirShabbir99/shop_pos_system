import { useState } from "react";
import { useGetSalesQuery } from "../../features/sale/saleApi";
import {
  Search, Loader2, ShoppingBag, Eye, X,
  ChevronLeft, ChevronRight, Calendar,
  TrendingUp, Receipt, CreditCard,
} from "lucide-react";

const PAY_COLORS = {
  cash:      "bg-emerald-50 text-emerald-700",
  card:      "bg-blue-50 text-blue-700",
  jazzcash:  "bg-orange-50 text-orange-700",
  easypaisa: "bg-green-50 text-green-700",
  split:     "bg-purple-50 text-purple-700",
};

// ─── Sale Detail Modal ────────────────────────────────────
const SaleDetailModal = ({ sale, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
        <div>
          <h2 className="font-semibold text-gray-800">{sale.saleNumber}</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(sale.createdAt).toLocaleString("en-PK")} · {sale.cashier?.name}
          </p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
          <X size={16} className="text-gray-500" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* Items */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase mb-2">Items</p>
          <div className="space-y-2">
            {sale.items?.map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-400">
                    {item.quantity} x Rs. {item.salePrice}
                  </p>
                </div>
                <span className="font-semibold text-gray-700 text-sm">
                  Rs. {item.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
          {[
            ["Subtotal",  `Rs. ${sale.subtotal?.toLocaleString()}`],
            ["Discount",  `- Rs. ${sale.discount?.toLocaleString()}`],
            ["Tax",       `Rs. ${sale.tax?.toLocaleString()}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-gray-600">
              <span>{k}</span><span>{v}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-gray-200">
            <span>Grand Total</span>
            <span className="text-indigo-600">Rs. {sale.grandTotal?.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment info */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          {[
            ["Payment",  sale.paymentMethod?.toUpperCase()],
            ["Cash Rcvd", `Rs. ${sale.cashReceived?.toLocaleString()}`],
            ["Change",    `Rs. ${sale.changeReturn?.toLocaleString()}`],
          ].map(([k, v]) => (
            <div key={k} className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">{k}</p>
              <p className="font-medium text-gray-700 text-xs">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────
const SalesHistoryPage = () => {
  const [page,          setPage]          = useState(1);
  const [search,        setSearch]        = useState("");
  const [startDate,     setStartDate]     = useState("");
  const [endDate,       setEndDate]       = useState("");
  const [payFilter,     setPayFilter]     = useState("");
  const [viewSale,      setViewSale]      = useState(null);

  const { data, isLoading, isFetching } = useGetSalesQuery({
    page, search, startDate, endDate, paymentMethod: payFilter,
  });

  const totalRevenue = data?.sales?.reduce((s, sale) => s + sale.grandTotal, 0) || 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Sales History</h1>
        <p className="text-sm text-gray-500 mt-0.5">All transactions record</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Sales",    value: data?.total || 0,                         icon: Receipt,    color: "bg-indigo-500" },
          { label: "Page Revenue",   value: `Rs. ${totalRevenue.toLocaleString()}`,   icon: TrendingUp, color: "bg-emerald-500" },
          { label: "This Page",      value: data?.sales?.length || 0,                 icon: ShoppingBag,color: "bg-violet-500" },
          { label: "Pages",          value: data?.pages || 0,                         icon: CreditCard, color: "bg-amber-500" },
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
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search sale number..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-gray-400" />
          <input type="date" value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <span className="text-gray-400 text-sm">—</span>
          <input type="date" value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <select value={payFilter} onChange={(e) => { setPayFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Payments</option>
          {["cash","card","jazzcash","easypaisa","split"].map((p) => (
            <option key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>

        {isFetching && <Loader2 size={16} className="animate-spin text-indigo-500" />}

        {(search || startDate || endDate || payFilter) && (
          <button onClick={() => { setSearch(""); setStartDate(""); setEndDate(""); setPayFilter(""); setPage(1); }}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition">
            <X size={13} /> Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3.5 text-left">Sale #</th>
                <th className="px-5 py-3.5 text-left">Items</th>
                <th className="px-5 py-3.5 text-left">Cashier</th>
                <th className="px-5 py-3.5 text-left">Payment</th>
                <th className="px-5 py-3.5 text-left">Date & Time</th>
                <th className="px-5 py-3.5 text-right">Discount</th>
                <th className="px-5 py-3.5 text-right">Total</th>
                <th className="px-5 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-400">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                    Loading...
                  </td>
                </tr>
              ) : data?.sales?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-400">
                    <ShoppingBag size={36} className="mx-auto mb-2 opacity-20" />
                    No sales found
                  </td>
                </tr>
              ) : (
                data?.sales?.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4">
                      <span className="font-medium text-indigo-600">{sale.saleNumber}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {sale.items?.length} item{sale.items?.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{sale.cashier?.name}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${PAY_COLORS[sale.paymentMethod] || "bg-gray-50 text-gray-600"}`}>
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(sale.createdAt).toLocaleString("en-PK", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-4 text-right text-emerald-600">
                      {sale.discount > 0 ? `- Rs. ${sale.discount}` : "—"}
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-gray-800">
                      Rs. {sale.grandTotal?.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button onClick={() => setViewSale(sale)}
                        className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition">
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {data.page} of {data.pages} — {data.total} total sales
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

      {viewSale && <SaleDetailModal sale={viewSale} onClose={() => setViewSale(null)} />}
    </div>
  );
};

export default SalesHistoryPage;