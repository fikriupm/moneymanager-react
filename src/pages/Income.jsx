import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import axiosConfig from "../util/axiosConfig.jsx";
import IncomeList from "../components/IncomeList.jsx";
import Modal from "../components/Modal.jsx";
import { Plus } from "lucide-react";
import AddIncomeForm from "../components/AddIncomeForm.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import IncomeOverview from "../components/IncomeOverview.jsx";
import PeriodFilter from "../components/PeriodFilter.jsx";

const Income = () => { 
  useUser(); 

  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  
  const [incomeData, setIncomeData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  });

  //fetch income from API
  const fetchIncomeDetails = async() => {
    if(loading) return;
    setLoading(true);
    try {
      // const  response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES)
      // fetch income data by month/year from backend
      const  response = await axiosConfig.get(API_ENDPOINTS.GET_INCOMES_BY_MONTH(selectedYear, selectedMonth))
      if(response.status === 200){
        setIncomeData(response.data);
      }

    } catch (error) {
      console.log("Error fetching income data:", error);
      toast.error(error.response?.data?.message || "Failed to fetch income data");
    } finally {
      setLoading(false);
    }
  }

  //fetch categories for income
  const fetchIncomeCategories = async() => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE('income'));
      if(response.status === 200){
        setCategories(response.data);
      }
    } catch (error) {
      console.log("Error fetching income categories:", error);
      toast.error(error.response?.data?.message || "Failed to fetch income categories");
    }
  }

  //save income details
  const handleAddIncome = async(income) => {
    const {name, amount, date, icon, categoryId} = income;

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
      const response = await axiosConfig.post(API_ENDPOINTS.GET_ALL_INCOMES, {
        name,
        amount: Number(amount),
        date,
        icon,
        categoryId
      });
      if(response.status === 201){
        toast.success("Income added successfully");
        setOpenAddIncomeModal(false);
        fetchIncomeDetails();
        fetchIncomeCategories();
      }
    } catch (error) {
      console.log("Error adding income:", error);
      toast.error(error.response?.data?.message || "Failed to add income");
    }
  }

  //delete income details
  const deleteIncome = async(id) => {
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));
      setOpenDeleteAlert({show: false, data: null});
      toast.success("Income deleted successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.log("Error deleting income:", error);
      toast.error(error.response?.data?.message || "Failed to delete income");
    } 
  }

  const handleReset = () => {
    const currentDate = new Date();
    setSelectedYear(currentDate.getFullYear());
    setSelectedMonth(currentDate.getMonth() + 1);
  }

  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.INCOME_EXCEL_DOWNLPOAD(selectedYear, selectedMonth), {
        responseType: 'blob', 
      });
      let filename = 'income_details.xlsx';
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Income details downloaded successfully");

    } catch (error) {
      console.log("Error downloading income details:", error);
      toast.error(error.response?.data?.message || "Failed to download income details");
    } 
  }

  const handleEmailIncomeDetails = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_INCOME(selectedYear, selectedMonth));
      if (response.status === 200){
        toast.success("Income details emailed successfully");
      }
    } catch (error) {
      console.log("Error emailing income details:", error);
      toast.error(error.response?.data?.message || "Failed to email income details");
    } 
  }

  useEffect(() => {
    fetchIncomeDetails();
    fetchIncomeCategories();
  // }, []);
  }, [selectedYear, selectedMonth]);

  return (
      <Dashboard activeMenu="Income"> 
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
              {/*overview for income with line char */}
              <div>
                <IncomeOverview transactions={incomeData} onAddIncome={() => setOpenAddIncomeModal(true)} />
              </div>
            </div>
            
            <IncomeList
                transactions={incomeData}
                onDelete={(id) => setOpenDeleteAlert({show: true, data: id})}
                onDownload={handleDownloadIncomeDetails}
                onEmail={handleEmailIncomeDetails}
              />

            {/* add income modal */}
            <Modal 
              isOpen={openAddIncomeModal}
              onClose={() => setOpenAddIncomeModal(false)}
              title="Add Income"
            >
              <AddIncomeForm 
                onAddIncome={(income) => handleAddIncome(income)}
                categories={categories}

              />
            </Modal>

            {/*delete income modal */}
            <Modal
              isOpen={openDeleteAlert.show}
              onClose={() => setOpenDeleteAlert({show: false, data: null})}
              title="Delete Income"
            >
              <DeleteAlert
                content="Are you sure you want to delete this income?"
                onDelete={() => deleteIncome(openDeleteAlert.data)}
              />
            </Modal>
          </div>
        </div>
      </Dashboard> 
  )
}

export default Income; 