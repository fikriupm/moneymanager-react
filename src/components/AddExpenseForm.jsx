import { useState, useEffect } from "react";
import EmojiPickerPopup from "./EmojiPickerPopup";
import Input from "./Input";
import { LoaderCircle, Sparkles, Plus } from "lucide-react";
import toast from "react-hot-toast";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";

const AddExpenseForm = ({onAddExpense, categories = [], onCategoryCreated}) => {

  const [expense, setExpense] = useState({
    name: '',
    amount: '',
    date: '',
    icon: '',
    categoryId: ''
  })

  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [aiHint, setAiHint] = useState(null);

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

  // Ask the AI to suggest a category from the typed description (does not save anything)
  const handleSuggestCategory = async () => {
    if (!expense.name.trim()) {
      toast.error("Enter an expense description first");
      return;
    }
    try {
      setSuggesting(true);
      const { data } = await axiosConfig.post(API_ENDPOINTS.CATEGORIZE_TRANSACTION, {
        description: expense.name,
        type: "expense",
      });
      setAiHint(data);
      if (data.existing && data.categoryId != null) {
        handleChange("categoryId", data.categoryId);
        toast.success(`AI matched category: ${data.categoryName}`);
      } else {
        toast(`AI suggests a new category: "${data.categoryName}". Click "Create & use" to add it.`, { icon: "✨" });
      }
    } catch (error) {
      console.log("Error suggesting category:", error);
      toast.error(error.response?.data?.message || "Failed to get AI suggestion");
    } finally {
      setSuggesting(false);
    }
  }

  // Create the AI-suggested new category, then select it in the dropdown
  const handleCreateSuggestedCategory = async () => {
    if (!aiHint?.categoryName) return;
    try {
      setCreatingCategory(true);
      const { data: created } = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {
        name: aiHint.categoryName,
        type: "expense",
        icon: expense.icon || "",
      });
      // Refresh the parent's dropdown so the new option appears, then select it
      if (onCategoryCreated) await onCategoryCreated();
      handleChange("categoryId", created.id);
      setAiHint(null);
      toast.success(`Created and selected "${created.name}"`);
    } catch (error) {
      console.log("Error creating category:", error);
      toast.error(error.response?.data?.message || "Failed to create category");
    } finally {
      setCreatingCategory(false);
    }
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

      <div className="mb-4 -mt-2">
        <button
          type="button"
          onClick={handleSuggestCategory}
          disabled={suggesting || !expense.name.trim()}
          className="inline-flex items-center gap-1.5 text-sm text-purple-700 hover:text-purple-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {suggesting
            ? <LoaderCircle className="h-4 w-4 animate-spin" />
            : <Sparkles className="h-4 w-4" />}
          {suggesting ? "Thinking..." : "Suggest category with AI"}
        </button>
      </div>

      <Input
        label="Category"
        value={expense.categoryId}
        onChange={({target}) => handleChange('categoryId', target.value)}
        isSelect={true}
        options={categoryOptions}
      />

      {aiHint && (
        <div className="-mt-2 mb-4">
          <p className="text-xs text-slate-500">
            ✨ {aiHint.existing
              ? `Matched “${aiHint.categoryName}”`
              : `Suggested new category “${aiHint.categoryName}” (not in your list yet)`}
            {" · "}{Math.round(aiHint.confidence * 100)}% confident
            {aiHint.reasoning ? ` · ${aiHint.reasoning}` : ""}
          </p>

          {!aiHint.existing && (
            <button
              type="button"
              onClick={handleCreateSuggestedCategory}
              disabled={creatingCategory}
              className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-green-700 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {creatingCategory
                ? <LoaderCircle className="h-4 w-4 animate-spin" />
                : <Plus className="h-4 w-4" />}
              {creatingCategory ? "Creating..." : `Create & use “${aiHint.categoryName}”`}
            </button>
          )}
        </div>
      )}

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
