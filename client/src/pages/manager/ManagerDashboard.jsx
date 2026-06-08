import { useGetManagerStatsQuery } from "../../features/dashboard/dashboardApi";
import StatCard from "../../components/dashboard/StatCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, ShoppingBag, AlertTriangle, Loader2, Clock } from "lucide-react";

const ManagerDashboard = () => {
  const { data, isLoading } = useGetManagerStatsQuery();

  if (isLoading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 size={32} className="animate-spin text-indigo-500" />
    </div>
  );

  const { stats, charts, lowStock, recentSales } = data || {};

  const dailyChart = charts?.last7Days?.map((d) => ({
    date: new Date(d._id).toLocaleDateString("en-PK", { weekday: "short" }),
    Revenue: d.total,
  })) || [];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Manager Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {new Date().toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Today Revenue"  value={`Rs. ${(stats?.todayRevenue || 0).toLocaleString()}`}  icon={TrendingUp}    color="bg-indigo-500" sub={`${stats?.todayOrders} orders`} />
        <StatCard label="Month Revenue"  value={`Rs. ${(stats?.monthRevenue || 0).toLocaleString()}`}  icon={ShoppingBag}   color="bg-emerald-500" sub={`${stats?.monthOrders} orders`} />
        <StatCard label="Low Stock"      value={stats?.lowStockCount || 0}  icon={AlertTriangle} color="bg-red-500" sub="Need restock" />
        <StatCard label="Month Orders"   value={stats?.monthOrders || 0}    icon={ShoppingBag}   color="bg-violet-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Last 7 Days Sales</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyChart}>
              <defs>
                <linearGradient id="mgColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "13px" }}
                formatter={(v) => [`Rs. ${v.toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="Revenue" stroke="#10B981" strokeWidth={2.5} fill="url(#mgColor)" dot={{ fill: "#10B981", r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Low Stock</h2>
          <div className="space-y-2.5">
            {lowStock?.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">All good! ✅</p>
            ) : lowStock?.map((p) => (
              <div key={p._id} className="flex items-center justify-between bg-red-50 rounded-xl px-3 py-2">
                <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                <span className="text-xs font-semibold text-red-600 ml-2 flex-shrink-0">
                  {p.stock} {p.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
   
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Recent Sales</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase">
              <tr>
                <th className="pb-3 text-left">Sale #</th>
                <th className="pb-3 text-left">Cashier</th>
                <th className="pb-3 text-left">Payment</th>
                <th className="pb-3 text-left">Time</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentSales?.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50 transition">
                  <td className="py-3 font-medium text-gray-800">{s.saleNumber}</td>
                  <td className="py-3 text-gray-600">{s.cashier?.name}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs capitalize">
                      {s.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400 flex items-center gap-1">
                    <Clock size={11} />
                    {new Date(s.createdAt).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="py-3 text-right font-semibold text-indigo-600">
                    Rs. {s.grandTotal.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;