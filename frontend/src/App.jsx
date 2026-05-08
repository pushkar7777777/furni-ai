import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Background3D from './components/Background3D';
import { CartProvider } from './context/CartContext';
import Skeleton from './components/Skeleton';

// Lazy loading components
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Products = lazy(() => import('./pages/Products'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Account = lazy(() => import('./pages/Account'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const Offers = lazy(() => import('./pages/Offers'));
const EMI = lazy(() => import('./pages/EMI'));
const Exchange = lazy(() => import('./pages/Exchange'));
const Rentals = lazy(() => import('./pages/Rentals'));
const Service = lazy(() => import('./pages/Service'));
const Suppliers = lazy(() => import('./pages/Suppliers'));
const Delivery = lazy(() => import('./pages/Delivery'));

// Dashboard lazy loading
const Expense = lazy(() => import('./pages/dashboard/Expense'));
const Vendor = lazy(() => import('./pages/dashboard/Vendor'));
const Quotation = lazy(() => import('./pages/dashboard/Quotation'));
const Notifications = lazy(() => import('./pages/dashboard/Notifications'));
const Employee = lazy(() => import('./pages/dashboard/Employee'));
const Attendance = lazy(() => import('./pages/dashboard/Attendance'));
const Category = lazy(() => import('./pages/dashboard/Category'));
const Inventory = lazy(() => import('./pages/dashboard/Inventory'));
const ProductsAdmin = lazy(() => import('./pages/dashboard/ProductsAdmin'));
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome'));
const RoomAI = lazy(() => import('./components/RoomAI'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0f0a07]">
    <div className="space-y-6 w-full max-w-md px-8">
      <Skeleton className="h-12 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-1/2 mx-auto" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  </div>
);

const ADMIN = 'admin';
const STAFF = 'staff';
const INVENTORY_MANAGER = 'inventory_manager';

const PublicLayout = () => (
  <div className="font-sans flex flex-col min-h-screen relative overflow-hidden">
    <Background3D />
    <Navbar />
    <main className="flex-grow relative z-10">
      <Outlet />
    </main>
  </div>
);

function App() {
  return (
    <CartProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<ProtectedRoute allowedRoles={['customer']}><Cart /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute allowedRoles={['customer']}><Checkout /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute allowedRoles={['customer']}><Wishlist /></ProtectedRoute>} />
              <Route path="/account" element={<ProtectedRoute allowedRoles={['customer', ADMIN, STAFF, INVENTORY_MANAGER]}><Account /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute allowedRoles={['customer']}><Orders /></ProtectedRoute>} />
              <Route path="/orders/:id" element={<ProtectedRoute allowedRoles={['customer']}><OrderDetails /></ProtectedRoute>} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/emi" element={<EMI />} />
              <Route path="/exchange" element={<Exchange />} />
              <Route path="/rentals" element={<Rentals />} />
              <Route path="/service" element={<Service />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/room-ai" element={<RoomAI />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={[ADMIN, STAFF, INVENTORY_MANAGER]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route
                path="expense"
                element={
                  <ProtectedRoute allowedRoles={[ADMIN]}>
                    <Expense />
                  </ProtectedRoute>
                }
              />
              <Route
                path="employee"
                element={
                  <ProtectedRoute allowedRoles={[ADMIN]}>
                    <Employee />
                  </ProtectedRoute>
                }
              />
              <Route
                path="attendance"
                element={
                  <ProtectedRoute allowedRoles={[ADMIN]}>
                    <Attendance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="vendor"
                element={
                  <ProtectedRoute allowedRoles={[ADMIN, INVENTORY_MANAGER]}>
                    <Vendor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="quotation"
                element={
                  <ProtectedRoute allowedRoles={[ADMIN, INVENTORY_MANAGER, STAFF]}>
                    <Quotation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="category"
                element={
                  <ProtectedRoute allowedRoles={[ADMIN, INVENTORY_MANAGER, STAFF]}>
                    <Category />
                  </ProtectedRoute>
                }
              />
              <Route
                path="products"
                element={
                  <ProtectedRoute allowedRoles={[ADMIN, INVENTORY_MANAGER, STAFF]}>
                    <ProductsAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="inventory"
                element={
                  <ProtectedRoute allowedRoles={[ADMIN, INVENTORY_MANAGER]}>
                    <Inventory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="notifications"
                element={
                  <ProtectedRoute allowedRoles={[ADMIN, STAFF, INVENTORY_MANAGER]}>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </CartProvider>
  );
}

export default App;
