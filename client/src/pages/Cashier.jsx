import DashboardShell from "../components/DashboardShell";
import { useGetCashierDashboardQuery } from "../features/dashboardApi";

const Cashier = () => {
  const { data, isLoading, error } = useGetCashierDashboardQuery();

  if (isLoading) return <div className="p-8">Loading cashier dashboard...</div>;
  if (error) return <div className="p-8">Failed to load dashboard.</div>;

  const stats = data?.stats || {};

  return (
    <DashboardShell
      title="Cashier Dashboard"
      subtitle="Create sales and manage daily checkout"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Sales Today" value={stats.salesToday} />
        <Card title="Revenue Today" value={`Rs ${stats.revenueToday}`} />
        <Card title="Receipts Issued" value={stats.receiptsIssued} />
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Recent Sales</h3>
        <div className="mt-4 space-y-3">
          {data?.recentSales?.map((sale) => (
            <div
              key={sale.id}
              className="flex items-center justify-between rounded-2xl border p-4"
            >
              <span>{sale.invoice}</span>
              <span className="font-medium">Rs {sale.total}</span>
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

export default Cashier;