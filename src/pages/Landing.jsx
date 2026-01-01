import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <div className="text-2xl">💰</div>
              <span className="text-xl font-bold text-gray-900">Money Manager</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-gray-600 hover:text-gray-900">Home</a>
              <a
                href="https://linktr.ee/fikrizaidakmal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                Contact
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="home">
        <div className="text-center py-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Take Control of Your Finances
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Your foundation for secure, intelligent financial management. Effortlessly
            track your income and expenses to achieve your financial goals.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/signup')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Start Tracking for Free
            </button>
            {/* <button 
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center gap-2"
            >
              Learn More <ArrowRight size={20} />
            </button> */}
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="pb-20">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">👤</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Fikri</h3>
                  <p className="text-sm text-gray-500">Details</p>
                </div>
              </div>
              <div className="text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-purple-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white">💰</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Balance</p>
                    <p className="text-2xl font-bold text-gray-900">$84,200</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white">📈</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Income</p>
                    <p className="text-2xl font-bold text-gray-900">$1,85,000</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white">📉</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Expense</p>
                    <p className="text-2xl font-bold text-gray-900">$1,00,800</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-4">Recent Transactions</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Freelance</p>
                        <p className="text-xs text-gray-500">13th Jul, 2025</p>
                      </div>
                    </div>
                    <span className="text-green-600 font-semibold">+$6,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Uber</p>
                        <p className="text-xs text-gray-500">12th Jul, 2025</p>
                      </div>
                    </div>
                    <span className="text-red-600 font-semibold">-$800</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-4">Financial Overview</h4>
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Balance</p>
                    <p className="text-3xl font-bold text-gray-900">$84,200</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            <a
              href="mailto:fikrizaidakmal@gmail.com"
              className="underline hover:text-white"
            >
              Fikri Zaid Akmal Bin Zulkafli
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
