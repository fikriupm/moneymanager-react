import Dashboard from '../components/Dashboard.jsx';
import { useUser } from '../hooks/useUser.jsx';
import InfoCard from '../components/InfoCard.jsx';
import { Coins, Wallet, WalletCards } from 'lucide-react';
import { addThousandSeparators } from '../util/util.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../util/apiEndpoints.js';
import toast from 'react-hot-toast';
import axiosConfig from '../util/axiosConfig.jsx';
import RecentTransactions from '../components/RecentTransactions.jsx';
import FinanceOverview from '../components/FinanceOverview.jsx';
import Transactions from '../components/Transactions.jsx';

const Home = () => {
  useUser(); 

  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async() => {
    if(loading) return;
    setLoading(true);
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.DASHBOARD_DATA);
      if(response.status === 200){
        console.log('dashboard data', response.data);
        setDashboardData(response.data);
      }
    }
    catch (error) {
      console.log("Error fetching dashboard data:", error);
      toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
    return () => {};
  } , []);

  return (
    <div>
      <Dashboard activeMenu="Dashboard"> 
        <div className="my-5 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/*display cards*/}
            <InfoCard
              icon={<WalletCards />}
              label="Total Balance"
              value={addThousandSeparators(dashboardData?.totalBalance || 0)}
              color="bg-purple-700"
              bgColor="bg-purple-50"
            />
            <InfoCard
              icon={<Wallet />}
              label="Total Income"
              value={addThousandSeparators(dashboardData?.totalIncomes || 0)}
              color="bg-green-700"
              bgColor="bg-green-50"
            />
            <InfoCard
              icon={<Coins />}
              label="Total Expense"
              value={addThousandSeparators(dashboardData?.totalExpenses || 0)}
              color="bg-red-700"
              bgColor="bg-red-50"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/*recent transactiios */}
            <RecentTransactions 
              transanctions={dashboardData?.recentTransactions}
              onMore={() => navigate('/expense')}
            />

            {/*finance overview */}
            <FinanceOverview
              totalBalance={dashboardData?.totalBalance}
              totalIncomes={dashboardData?.totalIncomes}
              totalExpenses={dashboardData?.totalExpenses}
            />
 
            {/*expense transactions */}
            <Transactions
              transactions={dashboardData?.recent5expenses || []}
              onMore={() => navigate('/expense')}
              type="expense"
              title="Recent Expenses"
            />

            {/*income transactions */}
            <Transactions
              transactions={dashboardData?.recent5incomes || []}
              onMore={() => navigate('/income')}
              type="income"
              title="Recent Incomes"
            />
          </div>
        </div>
      </Dashboard> 
    </div>
  )
}

export default Home;