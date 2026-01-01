import { RotateCcw } from "lucide-react";

const PeriodFilter = ({ selectedMonth, selectedYear, onMonthChange, onYearChange, onReset }) => {
  return (
    <div className="card p-4 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
          <h5 className="text-xl font-bold text-gray-800">Filter by Period</h5>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <label htmlFor="month" className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Month</label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => onMonthChange(Number(e.target.value))}
              className="appearance-none bg-white border-2 border-blue-200 rounded-lg px-4 py-2.5 pr-10 text-gray-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer hover:border-blue-300 shadow-sm"
            >
              <option value={1}>January</option>
              <option value={2}>February</option>
              <option value={3}>March</option>
              <option value={4}>April</option>
              <option value={5}>May</option>
              <option value={6}>June</option>
              <option value={7}>July</option>
              <option value={8}>August</option>
              <option value={9}>September</option>
              <option value={10}>October</option>
              <option value={11}>November</option>
              <option value={12}>December</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 top-6">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
              </svg>
            </div>
          </div>
          <div className="relative">
            <label htmlFor="year" className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Year</label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="appearance-none bg-white border-2 border-blue-200 rounded-lg px-4 py-2.5 pr-10 text-gray-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer hover:border-blue-300 shadow-sm"
            >
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 top-6">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
              </svg>
            </div>
          </div>
          <button
            onClick={onReset}
            className="mt-8 flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            title="Reset to current month"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeriodFilter;
