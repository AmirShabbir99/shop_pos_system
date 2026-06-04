import { useGetAdminStatsQuery } from "../../features/dashboard/dashboardApi";
import StatCard from "../../components/dashboard/StatCard";
import {
  AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, Package, Tag, Users,
  ShoppingBag, Loader2, AlertTriangle,
  CheckCircle, Clock,
} from "lucide-react";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const AdminDashboard = () => {
  const { data, isLoading } = useGetAdminStatsQuery();

  if (isLoading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 size={32} className="animate-spin text-indigo-500" />
    </div>
  );

  const { stats, charts, topProducts, lowStock, recentSales } = data || {};

  // Format chart data
  const dailyChart = charts?.last7Days?.map((d) => ({
    date: new Date(d._id).toLocaleDateString("en-PK", { weekday: "short" }),
    Revenue: d.total,
    Orders: d.count,
  })) || [];

  const monthlyChart = charts?.last6Months?.map((d) => ({
    month: new Date(d._id + "-01").toLocaleDateString("en-PK", { month: "short" }),
    Revenue: d.total,
  })) || [];

  const payChart = charts?.paymentBreakdown?.map((p) => ({
    name: p._id.charAt(0).toUpperCase() + p._id.slice(1),
    value: p.total,
  })) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {new Date().toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Today Revenue"  value={`Rs. ${(stats?.todayRevenue || 0).toLocaleString()}`}  icon={TrendingUp}   color="bg-indigo-500" sub={`${stats?.todayOrders || 0} orders today`} />
        <StatCard label="Month Revenue"  value={`Rs. ${(stats?.monthRevenue || 0).toLocaleString()}`}  icon={ShoppingBag}  color="bg-emerald-500" sub={`${stats?.monthOrders || 0} orders`} />
        <StatCard label="Total Revenue"  value={`Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`}  icon={TrendingUp}   color="bg-violet-500" />
        <StatCard label="Total Products" value={stats?.totalProducts || 0}  icon={Package}      color="bg-amber-500"   sub={`${stats?.totalCategories || 0} categories`} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Categories"    value={stats?.totalCategories || 0} icon={Tag}          color="bg-pink-500" />
        <StatCard label="Team Members"  value={stats?.totalUsers || 0}      icon={Users}        color="bg-cyan-500" />
        <StatCard label="Low Stock"     value={lowStock?.length || 0}       icon={AlertTriangle} color="bg-red-500" sub="Need attention" />
        <StatCard label="Today Orders"  value={stats?.todayOrders || 0}     icon={ShoppingBag}  color="bg-teal-500" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Daily Sales - Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Last 7 Days Sales</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyChart}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "13px" }}
                formatter={(v) => [`Rs. ${v.toLocaleString()}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="Revenue" stroke="#6366F1" strokeWidth={2.5} fill="url(#colorRev)" dot={{ fill: "#6366F1", r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Breakdown - Pie */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Payment Methods</h2>
          {payChart.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={payChart} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {payChart.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `Rs. ${v.toLocaleString()}`}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "13px" }} />
                <Legend iconType="circle" iconSize={8}
                  wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Monthly - Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyChart} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "13px" }}
                formatter={(v) => [`Rs. ${v.toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="Revenue" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Top Selling Products</h2>
          {topProducts?.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No sales yet</div>
          ) : (
            <div className="space-y-3">
              {topProducts?.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white
                    ${i === 0 ? "bg-amber-400" : i === 1 ? "bg-gray-400" : "bg-orange-300"}`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p._id}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                        <div className="h-1.5 bg-indigo-500 rounded-full"
                          style={{ width: `${Math.min(100, (p.totalQty / (topProducts[0]?.totalQty || 1)) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-700">{p.totalQty} sold</p>
                    <p className="text-xs text-gray-400">Rs. {p.totalRev.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Low Stock */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Low Stock Alert</h2>
            <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full font-medium">
              {lowStock?.length || 0} items
            </span>
          </div>
          {lowStock?.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm gap-2">
              <CheckCircle size={18} className="text-green-400" /> All stock levels good!
            </div>
          ) : (
            <div className="space-y-2.5">
              {lowStock?.map((p) => (
                <div key={p._id} className="flex items-center justify-between bg-red-50 rounded-xl px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800">{p.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                    {p.stock} {p.unit} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Recent Sales</h2>
          <div className="space-y-2.5">
            {recentSales?.map((s) => (
              <div key={s._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <ShoppingBag size={14} className="text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{s.saleNumber}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(s.createdAt).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}
                      {" · "}{s.cashier?.name}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-indigo-600">
                  Rs. {s.grandTotal.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;