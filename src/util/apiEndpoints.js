// Same-origin relative base: the browser calls /api/v1.0/... on whatever host
// served the SPA, and a reverse proxy forwards it to the backend.
//   - prod (nginx image): the /api/ location proxies to the backend service
//   - dev (`npm run dev`): the Vite server proxies /api to localhost:8080
// So one build artifact runs in every environment and CORS never applies.
// Override only for unusual setups (e.g. pointing dev at a remote API).
export const BASE_URL = import.meta.env.VITE_BASE_URL || "/api/v1.0";
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
  GET_INCOMES_BY_MONTH: (year, month) =>
    `/incomes/by-month?year=${year}&month=${month}`,
  CATEGORY_BY_TYPE: (type) => `/categories/${type}`,
  ADD_INCOME: "/incomes",
  DELETE_INCOME: (incomeId) => `/incomes/${incomeId}`,
  INCOME_EXCEL_DOWNLPOAD: (year, month) =>
    `/incomes/download/excel?year=${year}&month=${month}`,
  EMAIL_INCOME: (year, month) =>
    `/email/income-excel?year=${year}&month=${month}`,

  GET_ALL_EXPENSES: "/expenses",
  GET_EXPENSES_BY_MONTH: (year, month) =>
    `/expenses/by-month?year=${year}&month=${month}`,
  ADD_EXPENSE: "/expenses",
  DELETE_EXPENSE: (expenseId) => `/expenses/${expenseId}`,
  EXPENSE_EXCEL_DOWNLOAD: (year, month) =>
    `/expenses/download/excel?year=${year}&month=${month}`,
  EMAIL_EXPENSE: (year, month) =>
    `/email/expense-excel?year=${year}&month=${month}`,
  // alias kept for backwards-compatibility with existing code
  APPLY_FILTERS: "/filter",
  DASHBOARD_DATA: "/dashboard",
  // AI: suggest a category for a transaction description (no DB write)
  CATEGORIZE_TRANSACTION: "/ai/categorize",
  // AI: chat assistant grounded in the user's transactions
  AI_CHAT: "/ai/chat",
  // AI: RAG variant — retrieves only the most relevant transactions
  AI_CHAT_RAG: "/ai/chat-rag",
  UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
};

export default API_ENDPOINTS;
