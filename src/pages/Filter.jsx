import { Search } from "lucide-react";
import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { useState } from "react";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import axiosConfig from "../util/axiosConfig.jsx";
import TransactionInfoCard from "../components/TransactionInfoCard.jsx";
import moment from "moment";

const Filter = () => {
  useUser(); 
  const [type, setType] = useState('income');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [keyword, setKeyword] = useState('');
  const [sortField, setSortField] = useState('date');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosConfig.post(API_ENDPOINTS.APPLY_FILTERS, {
        type,
        startDate,
        endDate,
        sortOrder,
        keyword,
        sortField 
      });
      setTransactions(response.data);

    } catch (error) {
      console.log("Error fetching filtered transactions:", error);
      toast.error(error.response?.data?.message || "Failed to fetch filtered transactions");
    } finally {
      setLoading(false);
    }
  }

  return (
      <Dashboard activeMenu="Filter"> 
        <div className="my-5 mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Filter Transactions</h2>
          </div>
          
          {/* Filters Card */}
          <div className="card p-6 mb-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h5 className="text-lg font-semibold">Select the filters</h5>
            </div>
            <form className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4">
              <div> 
                <label className="block text-sm font-medium mb-1" htmlFor="type">Type</label>
                <select value={type} onChange={(e) => {setType(e.target.value); setTransactions([]);}} id="type" className="w-full border border-gray-300 rounded px-3 py-2">
                {/* <select value={type} onChange={(e) => {setType(e.target.value); setTransactions();}} id="type" className="w-full border border-gray-300 rounded px-3 py-2"> */}
                  {/* <option value="">All</option> */}
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label htmlFor="startdate" className="block text-sm font-medium mb-1">Start Date</label>
                <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" id="startdate" className="w-full border rounded p-3 py-2" />
              </div>
              <div>
                <label htmlFor="enddate" className="block text-sm font-medium mb-1">End Date</label>
                <input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" id="enddate" className="w-full border rounded p-3 py-2" />
              </div>
              <div>
                <label htmlFor="sortField" className="block text-sm font-medium mb-1">Sort Field</label>
                <select value={sortField} onChange={(e) => setSortField(e.target.value)} id="sortField" className="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="category">Category</option>
                </select>     
              </div>
              <div>
                <label htmlFor="sortorder" className="block text-sm font-medium mb-1">Sort Order</label>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} id="sortorder" className="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
              <div className="sm:col-span-1 md:col-span-1 flex items-end">
                <div className="w-full">
                  <label htmlFor="keyword" className="block text-sm font-medium mb-1">Search</label>
                  <input value={keyword} onChange={(e) => setKeyword(e.target.value)} type="text" id="keyword" placeholder="Search..." className="w-full border rounded p-3 py-2" />
                </div>
                <button onClick={handleSearch} className="ml-2 mb-1 p-2 bg-blue-800 hover:bg-purple-800 text-white rounded flex items-center justify-center cursor-pointer">
                  <Search size={20} />
                </button>
              </div>
            </form>
          </div>

          {/* Transactions Card */}
          <div className="card p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h5 className="text-lg font-semibold">Transactions</h5>
            </div>
            {transactions.length === 0 && !loading ? (
              <p className="text-gray-500 text-center py-8">Select the filters and click search to filter the transactions</p>
            ) : " "}
            {loading ? (
              <p className="text-gray-500 text-center py-8">Loading Transactions...</p>
            ) : ("")}
            <div className="grid grid-cols-1 gap-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="card p-1 shadow-sm hover:shadow-md transition-shadow">
                  <TransactionInfoCard 
                    title={transaction.name}
                    icon={transaction.icon}
                    date={moment(transaction.date).format("DD MMM, YYYY")}
                    amount={transaction.amount}
                    type={type}
                    hideDeleteBtn
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Dashboard> 
  )
}
export default Filter;