import { useState } from "react";
import {
  useGetSalesReportQuery,
  useGetInventoryReportQuery,
  useGetProfitReportQuery,
} from "../../features/report/reportApi";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, Package, BarChart2, Loader2,
  Download, Calendar, RefreshCw,
  ShoppingBag, Tag, Percent, AlertTriangle,
  CheckCircle, XCircle,
} from "lucide-react";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#F97316", "#EC4899"];

const TABS = [
  { id: "sales",     label: "Sales Report",     icon: TrendingUp },
  { id: "profit",    label: "Profit Report",    icon: BarChart2  },
  { id: "inventory", label: "Inventory Report", icon: Package    },
];

// ─── Date Presets ─────────────────────────────────────────
const getPreset = (preset) => {
  const now   = new Date();
  const today = now.toISOString().split("T")[0];
  switch (preset) {
    case "today":
      return { startDate: today, endDate: today };
    case "week": {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return { startDate: d.toISOString().split("T")[0], endDate: today };
    }
    case "month": {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      return { startDate: d.toISOString().split("T")[0], endDate: today };
    }
    case "year": {
      const d = new Date(now);
      d.setFullYear(d.getFullYear() - 1);
      return { startDate: d.toISOString().split("T")[0], endDate: today };
    }
    default:
      return { startDate: "", endDate: today };
  }
};

// ─── Stat Card ────────────────────────────────────────────
const RCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
    </div>
  </div>
);

// ─── Sales Report Tab ─────────────────────────────────────
const SalesTab = ({ startDate, endDate, groupBy }) => {
  const { data, isLoading } = useGetSalesReportQuery({ startDate, endDate, groupBy });

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Loader2 size={28} className="animate-spin text-indigo-500" />
    </div>
  );

  const { summary, chartData, paymentBreakdown, topProducts, topCategories } = data || {};

  const chart = chartData?.map((d) => ({
    date:     d._id,
    Revenue:  d.revenue,
    Orders:   d.orders,
    Discount: d.discount,
  })) || [];

  const pieData = paymentBreakdown?.map((p) => ({
    name:  p._id.charAt(0).toUpperCase() + p._id.slice(1),
    value: p.total,
    count: p.count,
  })) || [];

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <RCard label="Total Revenue"   value={`Rs. ${(summary?.totalRevenue  || 0).toLocaleString()}`} icon={TrendingUp} color="bg-indigo-500" />
        <RCard label="Total Orders"    value={summary?.totalOrders   || 0}  icon={ShoppingBag} color="bg-emerald-500" />
        <RCard label="Avg Order Value" value={`Rs. ${Math.round(summary?.avgOrderValue || 0).toLocaleString()}`} icon={BarChart2} color="bg-violet-500" />
        <RCard label="Total Discount"  value={`Rs. ${(summary?.totalDiscount || 0).toLocaleString()}`} icon={Percent}   color="bg-amber-500" />
        <RCard label="Total Tax"       value={`Rs. ${(summary?.totalTax      || 0).toLocaleString()}`} icon={Tag}       color="bg-pink-500" />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Revenue Over Time</h2>
        {chart.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data for selected range</div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={chart}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "12px" }}
                formatter={(v, n) => [n === "Revenue" ? `Rs. ${v.toLocaleString()}` : v, n]}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
              <Area type="monotone" dataKey="Revenue" stroke="#6366F1" strokeWidth={2.5} fill="url(#salesGrad)" dot={false} />
              <Bar dataKey="Orders" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} yAxisId={0} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Payment Pie */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Payment Methods</h2>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip
                  formatter={(v) => `Rs. ${v.toLocaleString()}`}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "12px" }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Top Products by Revenue</h2>
          {topProducts?.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data</div>
          ) : (
            <div className="space-y-3">
              {topProducts?.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0
                    ${i === 0 ? "bg-amber-400" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-orange-400" : "bg-indigo-300"}`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-800 truncate">{p._id}</p>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{p.qty} sold</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full">
                      <div className="h-1.5 bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (p.revenue / (topProducts[0]?.revenue || 1)) * 100)}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 flex-shrink-0">
                    Rs. {p.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Categories */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Revenue by Category</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={topCategories?.map(c => ({ name: c._id || "Unknown", Revenue: c.revenue })) || []} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "12px" }}
              formatter={(v) => [`Rs. ${v.toLocaleString()}`, "Revenue"]}
            />
            <Bar dataKey="Revenue" radius={[6, 6, 0, 0]}>
              {topCategories?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ─── Profit Report Tab ────────────────────────────────────
const ProfitTab = ({ startDate, endDate }) => {
  const { data, isLoading } = useGetProfitReportQuery({ startDate, endDate });

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Loader2 size={28} className="animate-spin text-indigo-500" />
    </div>
  );

  const { summary, profitByProduct, dailyProfit } = data || {};
  const margin = summary?.margin || 0;

  const chart = dailyProfit?.map((d) => ({
    date:    d._id,
    Revenue: d.revenue,
    Cost:    d.cost,
    Profit:  d.profit,
  })) || [];

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <RCard label="Total Revenue" value={`Rs. ${(summary?.totalRevenue || 0).toLocaleString()}`} icon={TrendingUp} color="bg-indigo-500" />
        <RCard label="Total Cost"    value={`Rs. ${(summary?.totalCost    || 0).toLocaleString()}`} icon={ShoppingBag} color="bg-red-500" />
        <RCard label="Net Profit"    value={`Rs. ${(summary?.totalProfit  || 0).toLocaleString()}`} icon={BarChart2} color="bg-emerald-500" />
        <RCard label="Profit Margin" value={`${Math.round(margin)}%`} icon={Percent} color="bg-violet-500"
          sub={margin >= 20 ? "Healthy margin" : "Needs improvement"} />
      </div>

      {/* Profit margin bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">Profit Margin</h2>
          <span className={`text-sm font-bold ${margin >= 20 ? "text-emerald-600" : margin >= 10 ? "text-amber-600" : "text-red-600"}`}>
            {Math.round(margin)}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full">
          <div
            className={`h-3 rounded-full transition-all duration-700 ${margin >= 20 ? "bg-emerald-500" : margin >= 10 ? "bg-amber-500" : "bg-red-500"}`}
            style={{ width: `${Math.min(100, margin)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0%</span><span>50%</span><span>100%</span>
        </div>
      </div>

      {/* Revenue vs Cost vs Profit Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Revenue vs Cost vs Profit</h2>
        {chart.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data for selected range</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chart} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "12px" }}
                formatter={(v) => `Rs. ${v.toLocaleString()}`}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="Revenue" fill="#6366F1" radius={[4,4,0,0]} barSize={14} />
              <Bar dataKey="Cost"    fill="#EF4444" radius={[4,4,0,0]} barSize={14} />
              <Bar dataKey="Profit"  fill="#10B981" radius={[4,4,0,0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Profit by product */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Profit by Product</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-right">Qty Sold</th>
                <th className="px-4 py-3 text-right">Revenue</th>
                <th className="px-4 py-3 text-right">Cost</th>
                <th className="px-4 py-3 text-right">Profit</th>
                <th className="px-4 py-3 text-right">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {profitByProduct?.map((p, i) => {
                const margin = p.revenue > 0 ? Math.round((p.profit / p.revenue) * 100) : 0;
                return (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{p._id}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{p.qty}</td>
                    <td className="px-4 py-3 text-right text-gray-600">Rs. {p.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-red-500">Rs. {(p.totalCost || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-600">Rs. {(p.profit || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                        ${margin >= 20 ? "bg-emerald-50 text-emerald-700" : margin >= 10 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"}`}>
                        {margin}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Inventory Report Tab ─────────────────────────────────
const InventoryTab = () => {
  const { data, isLoading } = useGetInventoryReportQuery();
  const [stockFilter, setStockFilter] = useState("all");

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Loader2 size={28} className="animate-spin text-indigo-500" />
    </div>
  );

  const { summary, products, categoryWise } = data || {};

  const filtered = products?.filter((p) => {
    if (stockFilter === "out")  return p.stock === 0;
    if (stockFilter === "low")  return p.stock > 0 && p.stock <= p.lowStockAlert;
    if (stockFilter === "ok")   return p.stock > p.lowStockAlert;
    return true;
  }) || [];

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <RCard label="Total Products"  value={summary?.totalProducts   || 0} icon={Package}       color="bg-indigo-500" />
        <RCard label="Stock Value"     value={`Rs. ${(summary?.totalStockValue || 0).toLocaleString()}`} icon={TrendingUp} color="bg-emerald-500" />
        <RCard label="Low Stock"       value={summary?.lowStock        || 0} icon={AlertTriangle}  color="bg-amber-500" sub="Need restock" />
        <RCard label="Out of Stock"    value={summary?.outOfStock      || 0} icon={XCircle}        color="bg-red-500"   sub="Urgent!" />
      </div>

      {/* Category wise */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Stock Value by Category</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={categoryWise?.map(c => ({ name: c._id || "Unknown", Value: c.totalValue, Count: c.count })) || []} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "12px" }}
              formatter={(v, n) => [n === "Value" ? `Rs. ${v.toLocaleString()}` : v, n]}
            />
            <Bar dataKey="Value" radius={[6,6,0,0]}>
              {categoryWise?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Product table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Product Stock Details</h2>
          <div className="flex gap-1.5">
            {[
              { id: "all", label: "All" },
              { id: "ok",  label: "In Stock" },
              { id: "low", label: "Low" },
              { id: "out", label: "Out" },
            ].map((f) => (
              <button key={f.id} onClick={() => setStockFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
                  ${stockFilter === f.id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3 text-right">Unit</th>
                <th className="px-4 py-3 text-right">Sale Price</th>
                <th className="px-4 py-3 text-right">Stock Value</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => {
                const stockValue = p.stock * p.salePrice;
                const isOut  = p.stock === 0;
                const isLow  = !isOut && p.stock <= p.lowStockAlert;
                return (
                  <tr key={p._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                    <td className="px-4 py-3 text-gray-500">{p.category?.name}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-700">{p.stock}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{p.unit}</td>
                    <td className="px-4 py-3 text-right text-indigo-600">Rs. {p.salePrice.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-700">Rs. {stockValue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                          <XCircle size={11} /> Out
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
                          <AlertTriangle size={11} /> Low
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                          <CheckCircle size={11} /> Good
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Main Reports Page ────────────────────────────────────
const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [groupBy,   setGroupBy]   = useState("day");
  const [preset,    setPreset]    = useState("month");
  const [dates,     setDates]     = useState(getPreset("month"));

  const handlePreset = (p) => {
    setPreset(p);
    setDates(getPreset(p));
  };

  const handleExport = () => {
    alert("CSV export feature — baad mein add karein!");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">Business analytics & insights</p>
        </div>
        <button onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
              ${activeTab === id ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      {activeTab !== "inventory" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
          <Calendar size={16} className="text-gray-400" />

          {/* Presets */}
          <div className="flex gap-1.5">
            {[
              { id: "today", label: "Today"  },
              { id: "week",  label: "7 Days" },
              { id: "month", label: "30 Days"},
              { id: "year",  label: "1 Year" },
            ].map((p) => (
              <button key={p.id} onClick={() => handlePreset(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
                  ${preset === p.id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <input type="date" value={dates.startDate}
              onChange={(e) => { setDates(d => ({ ...d, startDate: e.target.value })); setPreset(""); }}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span className="text-gray-400 text-sm">to</span>
            <input type="date" value={dates.endDate}
              onChange={(e) => { setDates(d => ({ ...d, endDate: e.target.value })); setPreset(""); }}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          {/* Group by (only sales tab) */}
          {activeTab === "sales" && (
            <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="day">Group by Day</option>
              <option value="week">Group by Week</option>
              <option value="month">Group by Month</option>
            </select>
          )}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === "sales"     && <SalesTab     startDate={dates.startDate} endDate={dates.endDate} groupBy={groupBy} />}
      {activeTab === "profit"    && <ProfitTab    startDate={dates.startDate} endDate={dates.endDate} />}
      {activeTab === "inventory" && <InventoryTab />}
    </div>
  );
};

export default ReportsPage;