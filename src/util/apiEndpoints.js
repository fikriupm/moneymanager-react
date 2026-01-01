// export const BASE_URL = "https://money-manager-api-zrx2.onrender.com/api/v1.0";
export const BASE_URL = "http://localhost:8080/api/v1.0";
  // baseURL: "http://localhost:5000/api",
const CLOUDINARY_CLOUD_NAME = "dxitnvyrt";

export const API_ENDPOINTS = {
  LOGIN: "/login",
  REGISTER: "/register",
  GET_USER_INFO: "/profile",
  GET_ALL_CATEGORIES: "/categories",
  ADD_CATEGORY: "/categories",
  UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
  GET_ALL_INCOMES: "/incomes",
  GET_INCOMES_BY_MONTH: (year, month) => `/incomes/by-month?year=${year}&month=${month}`,
  CATEGORY_BY_TYPE: (type) => `/categories/${type}`,
  ADD_INCOME: "/incomes",
  DELETE_INCOME: (incomeId) => `/incomes/${incomeId}`,
  // INCOME_EXCEL_DOWNLPOAD: "/incomes/download/excel", // old endpoint
  INCOME_EXCEL_DOWNLPOAD: "/excel/download/income",
  EMAIL_INCOME: "/email/income-excel",
  // EMAIL_INCOME: "/email/excel/income", old endpoint

  GET_ALL_EXPENSES: "/expenses",
  GET_EXPENSES_BY_MONTH: (year, month) => `/expenses/by-month?year=${year}&month=${month}`,
  ADD_EXPENSE: "/expenses",
  DELETE_EXPENSE: (expenseId) => `/expenses/${expenseId}`,
  EXPENSE_EXCEL_DOWNLOAD: "/excel/download/expense",
  EMAIL_EXPENSE: "/email/expense-excel",
  // alias kept for backwards-compatibility with existing code

  APPLY_FILTERS: "/filter",
  DASHBOARD_DATA: "/dashboard",
  UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
};

export default API_ENDPOINTS;