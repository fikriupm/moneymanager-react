import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { Plus } from "lucide-react";
import CategoryList from "../components/CategoryList.jsx";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import axiosConfig from "../util/axiosConfig.jsx";
import toast from "react-hot-toast";
import Modal from "../components/Modal.jsx";
import AddCategoryForm from "../components/AddCategoryForm.jsx";

const Category = () => {
  useUser(); 

  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategoryDetails = async() => {
    if(loading) return;

    setLoading(true);

    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
      if(response.status === 200){
        setCategoryData(response.data);
      }

    } catch (error) {
      console.log("Error fetching categories:", error);
      toast.error(error.message);

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategoryDetails();
  }, []); 

  const handleAddCategory = async (category) => {
    const {name, type, icon} = category;

    if(!name.trim() ){
      toast.error("Category name is required");
      return;
    }

    // checik if the category name already exists
    const isDuplicate = categoryData.some((category) => {
      return category.name.toLowerCase() === name.toLowerCase();
    })

    if(isDuplicate){
      toast.error("Category name already exists");
      return;
    }

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {name, type, icon})
      if (response.status === 201){
        toast.success("Category added successfully");
        setOpenAddCategoryModal(false);
        fetchCategoryDetails();
      }
    } catch (error) {
      console.log("Error adding category:", error);
      toast.error(error.response?.data?.message || "Failed to add category");
    }

  }

  const handleEditCategory = (categoryToEdit) => {
    setSelectedCategory(categoryToEdit);
    setOpenEditCategoryModal(true);
  }

  const handleUpdateCategory =  async (updaatedCategory) => {
    const {id, name, type, icon} = updaatedCategory;
    if(!name.trim() ){
      toast.error("Category name is required");
      return;
    }
    if(!id){
      toast.error("Invalid category ID");
      return;
    } 
    try {
      await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id), {name, type, icon});
      setOpenEditCategoryModal(false);
      setSelectedCategory(null);
      toast.success("Category updated successfully");
      fetchCategoryDetails();
    
    } catch (error) {
      console.log("Error updating category:", error);
      toast.error(error.response?.data?.message || "Failed to update category");
    }

    console.log("Update category:", updaatedCategory);
  }

  return (
      <Dashboard activeMenu="Category"> 
        <div className="my-5 mx-auto">
          {/* add buutton to add category */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-semibold">All Categories</h2>
            <button 
              onClick={()=> setOpenAddCategoryModal(true)}
              className="add-btn flex items-center gap-1 bg-blue-700 text-white px-3 py-2 rounded-lg">
              <Plus size={16} />
              Add Category
            </button>
          </div>
          {/* category list */}
          <CategoryList categories={categoryData} onEditCategory={handleEditCategory} />

          {/* modals for add/edit category */}
          <Modal
          
            isOpen={openAddCategoryModal}
            onClose ={() => setOpenAddCategoryModal(false)}
            title="Add Category Form"
          >
            <AddCategoryForm onAddCategory={handleAddCategory} />
          </Modal>
          {/*update category modal */}
          <Modal
            onClose ={() =>{
              setOpenEditCategoryModal(false);
              setSelectedCategory(null);
            }}
            isOpen={openEditCategoryModal}
            title="Update Category"
          >
            <AddCategoryForm
              initialCategoryData={selectedCategory}
              onAddCategory={handleUpdateCategory}
              isEditing={true}
            />
          </Modal>
        </div>
      </Dashboard> 
  )
} 
export default Category;