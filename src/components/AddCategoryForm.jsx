import { useState } from "react";
import Input from "./Input.jsx";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";

const AddCategoryForm = ({onAddCategory, initialCategoryData, isEditing}) => {

  const [category, setCategory] = useState({
    name: '',
    type: 'income',
    icon: ''
  })

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && initialCategoryData) {
      setCategory(initialCategoryData);
    } else {
      setCategory({
        name: '',
        type: 'income',
        icon: ''
      });
    }
    
  }, [isEditing, initialCategoryData]);

  const categoryTypeOptions = [
    {value: 'income', label: 'Income'},
    {value: 'expense', label: 'Expense'},
    // {value: 'savings', label: 'Savings'},
  ];

  const handleChange = (key, value) => {
    setCategory({...category, [key]: value});
  }

  const handleSubmit = async () => {
    try { 
      setLoading(true);
      await onAddCategory(category);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">

      <EmojiPickerPopup
        icon={category.icon}
        onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
      />

      <Input
        value = {category.name}
        onChange={({target}) => handleChange('name', target.value)}
        label="Category Name"
        placeHolder="e.g: Freelance, Salary, Grocery"
        type="text"
      />

      <Input
        label="Category Type"
        value={category.type}
        onChange={({target}) => handleChange('type', target.value)}
        isSelect={true}
        options={categoryTypeOptions}

      />

      <div className="flex justify-end mt-6">
        <button 
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
          {loading ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin" />
              {isEditing ? "Updating..." : "Adding..."}
            </>
          ) : (
            <>
              {isEditing ? "Update Category" : "Add Category"}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default AddCategoryForm; 