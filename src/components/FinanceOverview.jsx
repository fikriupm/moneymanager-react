import { addThousandSeparators } from "../util/util";
import CustomPieChart from "./CustomPieChart.jsx";

const FinanceOverview = ({totalBalance, totalIncomes, totalExpenses}) => {

  const COLORS = ['#4F46E5', '#EF4444', '#10B981'];
  const balanceData = [
    { name: 'Total Balance', amount: totalBalance },
    { name: 'Total Expense', amount: totalExpenses },
    { name: 'Total Income', amount: totalIncomes },
  ];
  
  return (
    <div className="card p-4 bg-white shadow-sm rounded border border-gray-200">
      <div className="mb-6">
        <h5 className="text-xl font-semibold text-gray-800">Financial Overview</h5>
      </div>
      <div className="flex items-center justify-center">
        <CustomPieChart
          data={balanceData}
          label="Total Balance"
          totalAmount={addThousandSeparators(totalBalance)}
          colors={COLORS}
          showTextAnchor
        />
      </div>
    </div>
  );
}
export default FinanceOverview;