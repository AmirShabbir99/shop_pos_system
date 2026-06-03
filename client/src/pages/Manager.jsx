import DashboardShell from "../components/DashboardShell";
import { useGetManagerDashboardQuery } from "../features/dashboardApi";

const Manager = () => {
  const { data, isLoading, error } = useGetManagerDashboardQuery();

  if (isLoading) return <div className="p-8">Loading manager dashboard...</div>;
  if (error) return <div className="p-8">Failed to load dashboard.</div>;

  const stats = data?.stats || {};

  return (
    <DashboardShell
      title="Manager Dashboard"
      subtitle="Monitor inventory and sales performance"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Total Products" value={stats.totalProducts} />
        <Card title="Low Stock Items" value={stats.lowStockItems} />
        <Card title="Sales Today" value={stats.totalSalesToday} />
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Inventory Alerts</h3>
        <div className="mt-4 space-y-3">
          {data?.inventoryAlerts?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border p-4"
            >
              <span>{item.name}</span>
              <span className="font-medium">Stock: {item.stock}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
};

const Card = ({ title, value }) => (
  <div className="rounded-3xl bg-white p-6 shadow-sm">
    <p className="text-sm text-slate-500">{title}</p>
    <h4 className="mt-2 text-3xl font-bold text-slate-900">{value}</h4>
  </div>
);

export default Manager;