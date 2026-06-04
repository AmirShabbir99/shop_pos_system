import { TrendingUp } from "lucide-react";

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start justify-between`}>
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
        <TrendingUp size={11} /> {sub}
      </p>}
    </div>
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
  </div>
);

export default StatCard;