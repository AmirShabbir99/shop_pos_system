import { useGetCashierStatsQuery } from "../../features/dashboard/dashboardApi";
import StatCard from "../../components/dashboard/StatCard";
import { TrendingUp, ShoppingBag, Loader2, Zap, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CashierDashboard = () => {
  const { data, isLoading } = useGetCashierStatsQuery();
  const navigate = useNavigate();

  if (isLoading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 size={32} className="animate-spin text-indigo-500" />
    </div>
  );

  const { stats, recentMySales } = data || {};

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cashier Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date().toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <button onClick={() => navigate("/cashier/pos")}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
          <Zap size={16} /> New Sale
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="My Today Revenue" value={`Rs. ${(stats?.myTodayRevenue || 0).toLocaleString()}`} icon={TrendingUp}  color="bg-indigo-500" sub={`${stats?.myTodayOrders} bills`} />
        <StatCard label="My Today Bills"   value={stats?.myTodayOrders || 0}   icon={ShoppingBag} color="bg-emerald-500" />
        <StatCard label="Store Revenue"    value={`Rs. ${(stats?.totalTodayRevenue || 0).toLocaleString()}`} icon={TrendingUp}  color="bg-violet-500" sub="Total store today" />
        <StatCard label="Store Orders"     value={stats?.totalTodayOrders || 0} icon={ShoppingBag} color="bg-amber-500" />
      </div>

      {/* Quick Sale Button */}
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
        <h2 className="text-lg font-bold mb-1">Ready to sell?</h2>
        <p className="text-indigo-200 text-sm mb-4">Click below to open POS screen</p>
        <button onClick={() => navigate("/cashier/pos")}
          className="bg-white text-indigo-600 font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition flex items-center gap-2">
          <Zap size={16} /> Open POS
        </button>
      </div>

      {/* My Recent Sales */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">My Recent Sales</h2>
        {recentMySales?.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-8">No sales yet today</p>
        ) : (
          <div className="space-y-2.5">
            {recentMySales?.map((s) => (
              <div key={s._id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <ShoppingBag size={14} className="text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{s.saleNumber}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(s.createdAt).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-indigo-600">Rs. {s.grandTotal.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 capitalize">{s.paymentMethod}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CashierDashboard;