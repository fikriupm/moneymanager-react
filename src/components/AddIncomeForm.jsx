import { useState, useEffect } from "react";
import EmojiPickerPopup from "./EmojiPickerPopup";
import Input from "./Input";
import { LoaderCircle } from "lucide-react";
const AddIncomeForm = ({onAddIncome, categories}) => {

  const [income, setIncome] = useState({
    name: '',
    amount: '',
    date: '',
    icon: '',
    categoryId: ''
  })

  // Set default categoryId to the first category when categories load
  useEffect(() => {
    if (categories.length > 0 && !income.categoryId) {
      setIncome(prev => ({
        ...prev,
        categoryId: categories[0].id
      }));
    }
  }, [categories, income.categoryId]);

  const [loading, setLoading] = useState(false);

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name
  }))

  const handleChange = (key, value) => {
    setIncome({...income, [key]: value});
  }

  const handleAddIncome = () => {
    setLoading (true);
    try {
      onAddIncome(income);  
    }finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <EmojiPickerPopup 
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
      />

      <Input 
        value={income.name}
        onChange={({target}) => handleChange('name', target.value)}
        label="Income Source"
        placeHolder="e.g. Salary, Freelance, Bonus"
        type="text"
      />

      <Input
        label="Category"
        value={income.categoryId}
        onChange={({target}) => handleChange('categoryId', target.value)}
        isSelect={true}
        options={categoryOptions}
      />

      <Input 
        label="Amount"
        value={income.amount}
        onChange={({target}) => handleChange('amount', target.value)}
        placeHolder="eg. 500.00"
        type="number"
      />

      <Input
        value={income.date}
        onChange={({target}) => handleChange('date', target.value)}
        label="Date"
        type="date"
        placeHolder=""
      />

      <div className="flex justify-end mt-6">
        <button
            onClick={() => handleAddIncome()}
            disabled={loading}
            className="add-btn flex items-center gap-1 bg-blue-700 text-white px-3 py-2 rounded-lg">
            {loading ? (
              <>
              <LoaderCircle className="w-4 h-4 animate-spin" />
              Adding...
              </>
            ) : (
              <>
                Add Income
              </>
            )}
        </button>
      </div>
    </div>
  )
}   

export default AddIncomeForm;