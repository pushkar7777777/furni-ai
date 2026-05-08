import React, { useState, memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ReceiptText, 
  FileText, 
  Info, 
  Building,
  UsersRound,
  CalendarCheck,
  Tags,
  Box,
  Menu,
  X,
  LogOut,
  Package,
  Armchair
} from 'lucide-react';

const Sidebar = memo(() => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  const role = localStorage.getItem('user_role');

  const isAdmin = role === 'admin';
  const isInventoryManager = role === 'inventory_manager';
  const isStaff = role === 'staff';

  const closeMobile = () => setIsMobileOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) => 
    `flex items-center gap-4 px-4 py-3 rounded-xl mx-2 transition-all text-sm font-bold ${
      isActive 
        ? 'bg-[#A67B5B] text-[#FFF8F0] shadow-lg shadow-[#A67B5B]/20 scale-[1.02]' 
        : 'text-[#FFF8F0]/60 hover:bg-white/5 hover:text-[#FFDAB9]'
    }`;

  const getRoleLabel = () => {
    if (isAdmin) return 'Administrator';
    if (isInventoryManager) return 'Inv. Manager';
    if (isStaff) return 'Staff member';
    return 'User';
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#2E1F13]/40 backdrop-blur-2xl text-[#FFF8F0] border-r border-[#FFDAB9]/10 shadow-2xl w-full">
      
      {/* Logo Header */}
      <div className="px-6 py-6 border-b border-[#FFDAB9]/10 flex items-center gap-4">
        <div className="w-10 h-10 bg-[#A67B5B] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#A67B5B]/20">
          <Armchair className="w-5 h-5 text-[#FFF8F0]" />
        </div>
        <div>
          <h2 className="font-serif text-base font-bold tracking-tight text-[#FFF8F0]">
            Saikamal<span className="font-light italic text-[#FFDAB9]"> Furniture</span>
          </h2>
          <p className="text-[10px] text-[#A67B5B] font-bold uppercase tracking-widest">{getRoleLabel()}</p>
        </div>
      </div>

      {/* Main Navigation Scroll */}
      <nav className="flex-1 overflow-y-auto py-6 space-y-6">
        
        {/* Common Links */}
        <div className="px-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFF8F0]/20 px-4 mb-3">Overview</p>
          <NavLink to="/dashboard/notifications" className={navLinkClass} onClick={closeMobile}>
            <Info className="w-4 h-4 shrink-0" />
            <span>Notifications</span>
          </NavLink>
          <NavLink to="/account" className={navLinkClass} onClick={closeMobile}>
            <UsersRound className="w-4 h-4 shrink-0" />
            <span>Manage Profile</span>
          </NavLink>
        </div>

        {/* Finance Section */}
        {isAdmin && (
          <div className="px-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFF8F0]/20 px-4 mb-3">Finance</p>
            <NavLink to="/dashboard/expense" className={navLinkClass} onClick={closeMobile}>
              <ReceiptText className="w-4 h-4 shrink-0" />
              <span>Expense</span>
            </NavLink>
            <NavLink to="/dashboard/quotation" className={navLinkClass} onClick={closeMobile}>
              <FileText className="w-4 h-4 shrink-0" />
              <span>Quotation</span>
            </NavLink>
          </div>
        )}

        {/* Inventory Section */}
        {(isAdmin || isInventoryManager || isStaff) && (
          <div className="px-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFF8F0]/20 px-4 mb-3">Inventory</p>
            {(isAdmin || isInventoryManager) && (
              <NavLink to="/dashboard/inventory" className={navLinkClass} onClick={closeMobile}>
                <Package className="w-4 h-4 shrink-0" />
                <span>Stock Control</span>
              </NavLink>
            )}
            <NavLink to="/dashboard/products" className={navLinkClass} onClick={closeMobile}>
              <Box className="w-4 h-4 shrink-0" />
              <span>Products</span>
            </NavLink>
            <NavLink to="/dashboard/category" className={navLinkClass} onClick={closeMobile}>
              <Tags className="w-4 h-4 shrink-0" />
              <span>Categories</span>
            </NavLink>
            {(isAdmin || isInventoryManager) && (
              <NavLink to="/dashboard/vendor" className={navLinkClass} onClick={closeMobile}>
                <Building className="w-4 h-4 shrink-0" />
                <span>Vendors</span>
              </NavLink>
            )}
            <NavLink to="/dashboard/quotation" className={navLinkClass} onClick={closeMobile}>
              <FileText className="w-4 h-4 shrink-0" />
              <span>Quotations</span>
            </NavLink>
          </div>
        )}

        {/* HR & Staff Section */}
        {isAdmin && (
          <div className="px-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFF8F0]/20 px-4 mb-3">HR & Staff</p>
            <NavLink to="/dashboard/employee" className={navLinkClass} onClick={closeMobile}>
              <UsersRound className="w-4 h-4 shrink-0" />
              <span>Employees</span>
            </NavLink>
            <NavLink to="/dashboard/attendance" className={navLinkClass} onClick={closeMobile}>
              <CalendarCheck className="w-4 h-4 shrink-0" />
              <span>Attendance</span>
            </NavLink>
          </div>
        )}

      </nav>
      
      {/* Footer / Logout */}
      <div className="p-4 border-t border-[#FFDAB9]/10 space-y-2">
        <NavLink to="/" className="flex items-center gap-3 px-4 py-3 mx-2 text-sm font-bold text-[#FFF8F0]/40 hover:text-[#FFF8F0] hover:bg-white/5 rounded-xl transition-all">
          <Armchair className="w-4 h-4" />
          <span>View Website</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 mx-2 text-sm font-bold text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          style={{ width: 'calc(100% - 1rem)' }}
        >
          <LogOut className="w-4 h-4" />
          <span>End Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#2C3A32] text-[#FAF9F6] rounded-lg shadow-lg"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={closeMobile} />
          <div className="relative w-72 max-w-full flex-1 z-50">
            <button className="absolute top-4 right-4 text-[#1A1A1A]/60 hover:text-[#1A1A1A] p-2 z-10" onClick={closeMobile}>
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 z-30 h-full">
        {sidebarContent}
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
