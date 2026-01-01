import { ArrowRight } from "lucide-react";
import moment from "moment";
import TransactionInfoCard from "./TransactionInfoCard.jsx";  

const Transactions = ({transactions, onMore, type, title}) => {

  return (
    <div>
      {/* Transactions component content */}
    <div className="card p-4 bg-white shadow-sm rounded border border-gray-200">
        <div className="flex items-center justify-between">
          <h5 className="text-lg">{title}</h5>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium" onClick={onMore}>
          More <ArrowRight size={16} />
        </button>
        </div>
        <div className="mt-6">
          {transactions?.slice(0, 5)?.map(item => (
            <TransactionInfoCard 
              key={item.id}
              title={item.name}
              icon={item.icon}
              date={moment(item.date).format("DD MMM, YYYY")}
              amount={item.amount}
              type={type}
              hideDeleteBtn
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default Transactions;

