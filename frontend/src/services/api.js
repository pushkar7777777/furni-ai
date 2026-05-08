import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  const userId = localStorage.getItem("user_id");

  config.headers = config.headers || {};
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (userId) config.headers["x-user-id"] = userId;
  return config;
});

// Products
export const getProducts = async () => (await api.get('/products')).data;
export const getProductById = async (id) => (await api.get(`/products/${id}`)).data;
export const createProduct = async (data) => (await api.post('/products', data)).data;
export const updateProduct = async (id, data) => (await api.put(`/products/${id}`, data)).data;
export const deleteProduct = async (id) => (await api.delete(`/products/${id}`)).data;
export const addToCart = async (data) => (await api.post('/cart/add', data)).data;
export const getCart = async () => (await api.get('/cart')).data;
export const updateCartItem = async (data) => (await api.put('/cart/update', data)).data;
export const removeCartItem = async (id) => (await api.delete(`/cart/${id}`)).data;
export const placeOrder = async (data) => (await api.post('/order', data)).data;
export const addToWishlist = async (data) => (await api.post('/wishlist', data)).data;
export const getWishlist = async () => (await api.get('/wishlist')).data;
export const removeWishlistItem = async (id) => (await api.delete(`/wishlist/${id}`)).data;
export const addReview = async (data) => (await api.post('/reviews', data)).data;
export const updateReview = async (id, data) => (await api.put(`/reviews/${id}`, data)).data;
export const deleteReview = async (id) => (await api.delete(`/reviews/${id}`)).data;

// AI
export const getAIRecommendation = async (params) => (await api.post('/ai/recommend', params)).data;
export const getAIProductMatches = async (data) => (await api.post('/ai/recommend-products', data)).data;

// Auth
export const registerUser = async (userData) => (await api.post('/auth/register', userData)).data;
export const loginUser = async (credentials) => (await api.post('/auth/login', credentials)).data;
export const forgotPassword = async (email) => (await api.post('/auth/forgot-password', { email })).data;
export const resetPassword = async (payload) => (await api.post('/auth/reset-password', payload)).data;
export const getMyProfile = async () => (await api.get('/auth/me')).data;
export const updateMyProfile = async (data) => (await api.put('/auth/me', data)).data;

// Orders
export const getOrders = async () => (await api.get('/order')).data;
export const getOrderById = async (id) => (await api.get(`/order/${id}`)).data;
export const cancelOrder = async (id) => (await api.put(`/order/${id}/cancel`)).data;
export const getReceipt = async (orderId) => (await api.get(`/receipts/${orderId}`)).data;


// Categories - Core
export const getCategories = async () => (await api.get('/categories')).data;
export const getCategoryById = async (id) => (await api.get(`/categories/${id}`)).data;
export const createCategory = async (data) => (await api.post('/categories', data)).data;
export const updateCategory = async (id, data) => (await api.put(`/categories/${id}`, data)).data;
export const deleteCategory = async (id) => (await api.delete(`/categories/${id}`)).data;
export const getProductsByCategory = async (categoryId) => (await api.get(`/categories/${categoryId}/products`)).data;
export const getCategoryStats = async () => (await api.get('/categories/stats')).data;

// Vendors - Core
export const getVendors = async () => (await api.get('/vendors')).data;
export const getVendorById = async (id) => (await api.get(`/vendors/${id}`)).data;
export const createVendor = async (data) => (await api.post('/vendors', data)).data;
export const updateVendor = async (id, data) => (await api.put(`/vendors/${id}`, data)).data;
export const deleteVendor = async (id) => (await api.delete(`/vendors/${id}`)).data;
export const getVendorStats = async () => (await api.get('/vendors/stats')).data;
export const searchVendors = async (query) => (await api.get('/vendors/search', { params: { query } })).data;
export const getVendorsByCity = async (city) => (await api.get(`/vendors/city/${city}`)).data;
export const rateVendor = async (id, rating) => (await api.put(`/vendors/${id}/rate`, { rating })).data;

// Quotations - Core
export const getQuotations = async () => (await api.get('/quotations')).data;
export const getQuotationById = async (id) => (await api.get(`/quotations/${id}`)).data;
export const createQuotation = async (data) => (await api.post('/quotations', data)).data;
export const updateQuotation = async (id, data) => (await api.put(`/quotations/${id}`, data)).data;
export const updateQuotationStatus = async (id, status) => (await api.put(`/quotations/${id}/status`, { status })).data;
export const deleteQuotation = async (id) => (await api.delete(`/quotations/${id}`)).data;
export const getQuotationStats = async () => (await api.get('/quotations/stats')).data;
export const getQuotationsByStatus = async (status) => (await api.get(`/quotations/status/${status}`)).data;
export const getQuotationsByVendor = async (vendorId) => (await api.get(`/quotations/vendor/${vendorId}`)).data;

// Inventory - Core
export const getInventoryStats = async () => (await api.get('/inventory/stats')).data;
export const getLowStockProducts = async () => (await api.get('/inventory/low-stock')).data;
export const getInventoryLogs = async () => (await api.get('/inventory/logs')).data;
export const updateStock = async (data) => (await api.post('/inventory/update', data)).data;
export const getAllProductsStock = async () => (await api.get('/inventory/all-stock')).data;
export const getProductStock = async (id) => (await api.get(`/inventory/${id}`)).data;
export const getInventoryReport = async (params) => (await api.get('/inventory/report', { params })).data;

// Employees - Core
export const getEmployees = async () => (await api.get('/employees')).data;
export const getEmployeeById = async (id) => (await api.get(`/employees/${id}`)).data;
export const createEmployee = async (data) => (await api.post('/employees', data)).data;
export const updateEmployee = async (id, data) => (await api.put(`/employees/${id}`, data)).data;
export const deleteEmployee = async (id) => (await api.delete(`/employees/${id}`)).data;
export const getEmployeeStats = async () => (await api.get('/employees/stats')).data;
export const getEmployeesByRole = async (role) => (await api.get(`/employees/role/${role}`)).data;
export const getEmployeesByStatus = async (status) => (await api.get(`/employees/status/${status}`)).data;
export const searchEmployees = async (query) => (await api.get('/employees/search', { params: { query } })).data;
export const getAllRoles = async () => (await api.get('/employees/roles/all')).data;

// Attendance - Core
export const getAttendance = async (date) => (await api.get('/attendance', { params: { date } })).data;
export const logAttendance = async (data) => (await api.post('/attendance', data)).data;
export const getEmployeeAttendance = async (id) => (await api.get(`/attendance/employee/${id}`)).data;
export const getAttendanceStats = async (params) => (await api.get('/attendance/stats', { params })).data;
export const getTodaysSummary = async () => (await api.get('/attendance/summary/today')).data;
export const checkIn = async (data) => (await api.post('/attendance/check-in', data)).data;
export const checkOut = async (data) => (await api.post('/attendance/check-out', data)).data;
export const getAttendanceReport = async (params) => (await api.get('/attendance/report', { params })).data;
export const getAttendancePercentage = async (employeeId) => (await api.get('/attendance/percentage', { params: { employeeId } })).data;

// Expenses - Core
export const getExpenses = async () => (await api.get('/expenses')).data;
export const getExpenseById = async (id) => (await api.get(`/expenses/${id}`)).data;
export const createExpense = async (data) => (await api.post('/expenses', data)).data;
export const updateExpense = async (id, data) => (await api.put(`/expenses/${id}`, data)).data;
export const deleteExpense = async (id) => (await api.delete(`/expenses/${id}`)).data;
export const getExpenseStats = async (params) => (await api.get('/expenses/stats', { params })).data;
export const getExpensesByCategory = async (category) => (await api.get(`/expenses/category/${category}`)).data;
export const getExpensesByStatus = async (status) => (await api.get(`/expenses/status/${status}`)).data;
export const getExpensesByDateRange = async (params) => (await api.get('/expenses/date-range', { params })).data;
export const getExpenseCategories = async () => (await api.get('/expenses/categories')).data;
export const getMonthlyExpenseSummary = async () => (await api.get('/expenses/monthly-summary')).data;
export const approveExpense = async (id) => (await api.put(`/expenses/${id}/approve`)).data;
export const rejectExpense = async (id, reason) => (await api.put(`/expenses/${id}/reject`, { reason })).data;

// Notifications / Alerts
export const getAlerts = async () => (await api.get('/alerts')).data;
export const clearAlerts = async () => (await api.delete('/alerts')).data;

// Reports

export const downloadSalesReport = async () => {
  const response = await api.get('/reports/sales/csv', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'sales_report.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export default api;
