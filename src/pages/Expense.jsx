import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import axiosConfig from "../util/axiosConfig.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import Modal from "../components/Modal.jsx";
import { Plus } from "lucide-react";
import AddExpenseForm from "../components/AddExpenseForm.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import ExpenseOverview from "../components/ExpenseOverview.jsx";
import PeriodFilter from "../components/PeriodFilter.jsx";

const Expense = () => {  
  useUser(); 

  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);

  const [expenseData, setExpenseData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  });

  //fetch expense from API
  const fetchExpenseDetails = async() => {
    if(loading) return;
    setLoading(true);
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_EXPENSES_BY_MONTH(selectedYear, selectedMonth))
      if(response.status === 200){
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("Error fetching expense data:", error);
      toast.error(error.response?.data?.message || "Failed to fetch expense data");
    } finally {
      setLoading(false);
    }
  }

  //fetch categories for expense
  const fetchExpenseCategories = async() => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE('expense'));
      if(response.status === 200){
        setCategories(response.data);
      }
    } catch (error) {
      console.log("Error fetching expense categories:", error);
      toast.error(error.response?.data?.message || "Failed to fetch expense categories");
    }
  }

  //save expense details
  const handleAddExpense = async(expense) => {
    const {name, amount, date, icon, categoryId} = expense;

    //validations
    if(!name.trim()){
      toast.error("Please enter a name");
      return;
    }

    if(!amount || isNaN(amount) || Number(amount) <= 0){
      toast.error("Amount should be a valid number greater than zero");
      return;
    }

    if(!date){
      toast.error("Please enter a date");
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if(date > today){
      toast.error("Date cannot be in the future");
      return;
    }

    if(!categoryId){
      toast.error("Please select a category");
      return;
    }

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, {
        name,
        amount: Number(amount),
        date,
        icon,
        categoryId
      });
      if(response.status === 201){
        toast.success("Expense added successfully");
        setOpenAddExpenseModal(false);
        fetchExpenseDetails();
      }
    } catch (error) {
      console.log("Error adding expense:", error);
      toast.error(error.response?.data?.message || "Failed to add expense");
    }
  }

  //delete expense details
  const deleteExpense = async(id) => {
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));
      setOpenDeleteAlert({show: false, data: null});
      toast.success("Expense deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.log("Error deleting expense:", error);
      toast.error(error.response?.data?.message || "Failed to delete expense");
    } 
  }

  const handleReset = () => {
    const currentDate = new Date();
    setSelectedYear(currentDate.getFullYear());
    setSelectedMonth(currentDate.getMonth() + 1);
  }

  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD, {
        responseType: 'blob', 
      });
      const filename = 'expense_details.xlsx';
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Expense details downloaded successfully");
    } catch (error) {
      console.log("Error downloading expense details:", error);
      toast.error(error.response?.data?.message || "Failed to download expense details");
    } 
  }

  const handleEmailExpenseDetails = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_EXPENSE);
      if (response.status === 200){
        toast.success("Expense details emailed successfully");
      }
    } catch (error) {
      console.log("Error emailing expense details:", error);
      toast.error(error.response?.data?.message || "Failed to email expense details");
    } 
  }

  useEffect(() => {
    fetchExpenseDetails();
    fetchExpenseCategories();
  }, [selectedYear, selectedMonth]);

  return (
      <Dashboard activeMenu="Expense"> 
        <div className="my-5 mx-auto">
          <PeriodFilter 
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            onReset={handleReset}
          />

          <div className="grid grid-cols-1 gap-4">
            <div>
              <div>
                <ExpenseOverview transactions={expenseData} onAddExpense={() => setOpenAddExpenseModal(true)} />
              </div>
            </div>
            
            <ExpenseList
                transactions={expenseData}
                onDelete={(id) => setOpenDeleteAlert({show: true, data: id})}
                onDownload={handleDownloadExpenseDetails}
                onEmail={handleEmailExpenseDetails}
              />

            {/* add expense modal */}
            <Modal 
              isOpen={openAddExpenseModal}
              onClose={() => setOpenAddExpenseModal(false)}
              title="Add Expense"
            >
              <AddExpenseForm 
                onAddExpense={(expense) => handleAddExpense(expense)}
                categories={categories}
              />
            </Modal>

            {/*delete expense modal */}
            <Modal
              isOpen={openDeleteAlert.show}
              onClose={() => setOpenDeleteAlert({show: false, data: null})}
              title="Delete Expense"
            >
              <DeleteAlert
                content="Are you sure you want to delete this expense?"
                onDelete={() => deleteExpense(openDeleteAlert.data)}
              />
            </Modal>
          </div>
        </div>
      </Dashboard> 
  )
}

export default Expense;