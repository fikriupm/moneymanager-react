import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import CustomLineChart from './CustomLineChart.jsx';

const ExpenseOverview = ({transactions, onAddExpense}) => {

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      // Group transactions by date and sum amounts
      const grouped = {};
      transactions.forEach(tx => {
        const date = tx.date;
        if (!grouped[date]) {
          grouped[date] = { date, total: 0, details: {} };
        }
        grouped[date].total += Number(tx.amount);
        grouped[date].details[tx.name] = (grouped[date].details[tx.name] || 0) + Number(tx.amount);
      });

      // Convert to array and sort by date
      const data = Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
      setChartData(data);
    } else {
      setChartData([]);
    }
  }, [transactions]);

  return (
    <div className="card p-4 bg-white shadow-sm rounded border border-gray-200">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h5 className="text-lg font-semibold">
            Expense Overview
          </h5>
          <p className="text-sm text-gray-600">
            Track your spending over time and analyse your expense trends.
          </p>
        </div>
        <button 
          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition"
          onClick={onAddExpense}>
          <Plus size={16}/>
          Add Expense
        </button>
      </div>

      <div className="mt-6">
        {/*line chart*/}
        <CustomLineChart data={chartData} />
      </div>
    </div>
  )
}
export default ExpenseOverview;
