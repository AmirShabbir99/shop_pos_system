import DashboardShell from "../components/DashboardShell";
import { useGetAdminDashboardQuery } from "../features/dashboardApi";

const Admin = () => {
  const { data, isLoading, error } = useGetAdminDashboardQuery();

  if (isLoading) return <div className="p-8">Loading admin dashboard...</div>;
  if (error) return <div className="p-8">Failed to load dashboard.</div>;

  const stats = data?.stats || {};

  return (
    <DashboardShell
      title="Admin Dashboard"
      subtitle="Manage users and system overview"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Total Users" value={stats.totalUsers} />
        <Card title="Managers" value={stats.totalManagers} />
        <Card title="Cashiers" value={stats.totalCashiers} />
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">System Status</h3>
        <p className="mt-2 text-slate-600">{data?.systemStatus}</p>
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

export default Admin;