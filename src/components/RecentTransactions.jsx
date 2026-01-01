import { ArrowRight } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard.jsx";
import moment from "moment";

const RecentTransactions = ({transanctions, onMore}) => {
  return (
    <div className="card p-4 bg-white shadow-sm rounded border border-gray-200">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-semibold text-gray-800">Recent Transactions</h5>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium" onClick={onMore}>
          More <ArrowRight size={16} />
        </button>
      </div>
      <div className="mt-6">
        {transanctions?.slice(0, 5).map((item) => (
          <TransactionInfoCard
            key={item.id}
            title={item.name}
            icon={item.icon}
            date={moment(item.date).format("DD MMM, YYYY")}
            amount={item.amount}
            type={item.type}
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  )
}
export default RecentTransactions;