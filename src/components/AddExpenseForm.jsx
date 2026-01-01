import { useState, useEffect } from "react";
import EmojiPickerPopup from "./EmojiPickerPopup";
import Input from "./Input";
import { LoaderCircle } from "lucide-react";

const AddExpenseForm = ({onAddExpense, categories = []}) => {

  const [expense, setExpense] = useState({
    name: '',
    amount: '',
    date: '',
    icon: '',
    categoryId: ''
  })

  const [loading, setLoading] = useState(false);

  // Set default categoryId to the first category when categories load
  useEffect(() => {
    if (categories.length > 0 && !expense.categoryId) {
      setExpense(prev => ({
        ...prev,
        categoryId: categories[0].id
      }));
    }
  }, [categories]);

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name
  }))

  const handleChange = (key, value) => {
    setExpense({...expense, [key]: value});
  }

  const handleSubmit = async () => {
    try { 
      setLoading(true);
      await onAddExpense(expense);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <EmojiPickerPopup 
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
      />

      <Input 
        value={expense.name}
        onChange={({target}) => handleChange('name', target.value)}
        label="Expense Source"
        placeHolder="e.g. Grocery, Rent, Transportation"
        type="text"
      />

      <Input
        label="Category"
        value={expense.categoryId}
        onChange={({target}) => handleChange('categoryId', target.value)}
        isSelect={true}
        options={categoryOptions}
      />

      <Input 
        label="Amount"
        value={expense.amount}
        onChange={({target}) => handleChange('amount', target.value)}
        placeHolder="eg. 500.00"
        type="number"
      />

      <Input
        value={expense.date}
        onChange={({target}) => handleChange('date', target.value)}
        label="Date"
        type="date"
        placeHolder=""
      />

      <div className="flex justify-end mt-6">
        <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center gap-2 transition">
          {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </div>
    </div>
  )
}   

export default AddExpenseForm;
