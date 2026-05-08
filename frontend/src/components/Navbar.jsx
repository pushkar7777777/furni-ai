import React, { useState, useEffect, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, LayoutDashboard, LogOut, Menu, PackageSearch, ShoppingCart, Sofa, UserRound, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const isLoggedIn = !!localStorage.getItem('auth_token');
  const userRole = localStorage.getItem('user_role');
  const isCustomer = userRole === 'customer';

  const dashboardHome = () => {
    if (userRole === 'admin') return '/dashboard/expense';
    if (userRole === 'inventory_manager') return '/dashboard/products';
    if (userRole === 'staff') return '/dashboard/notifications';
    return '/login';
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      // Use requestAnimationFrame for smoother scroll handling
      let ticking = false;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 24);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = `fixed w-full z-50 transition-all duration-500 border-b ${
    isScrolled
      ? 'bg-[#2E1F13]/88 backdrop-blur-xl shadow-lg border-[#FFDAB9]/10'
      : 'bg-[#2E1F13]/55 backdrop-blur-md border-transparent'
  }`;

  const customerLinks = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: 'RoomAI ✨', to: '/room-ai' },
    { label: 'Orders', to: '/orders', icon: PackageSearch },
    { label: 'Wishlist', to: '/wishlist', icon: Heart },
    { label: 'Cart', to: '/cart', icon: ShoppingCart, badge: cartCount },
    { label: 'Account', to: '/account', icon: UserRound }
  ].filter(link => {
    if (!isCustomer && (userRole === 'staff' || userRole === 'inventory_manager')) {
      return link.label === 'Home' || link.label === 'Account';
    }
    return true;
  });

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-5">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#A67B5B] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#A67B5B]/20">
              <Sofa className="w-5 h-5 text-[#FFF8F0] transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-[#FFF8F0]">Saikamal<span className="font-light italic text-[#FFDAB9]"> Furnitures</span></span>
          </Link>

          <div className="hidden md:flex gap-8 items-center">
            {customerLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`relative inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase transition-all hover:text-[#FFDAB9] ${
                    location.pathname === item.to ? 'text-[#FFF8F0]' : 'text-[#FFF8F0]/60'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="absolute -right-4 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FFDAB9] px-1.5 text-[10px] font-black text-[#2E1F13]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {isLoggedIn && !isCustomer && (
              <Link
                to={dashboardHome()}
                className={`text-xs tracking-[0.2em] uppercase transition-all px-4 py-1.5 rounded-lg border border-[#A67B5B]/30 hover:border-[#A67B5B] inline-flex items-center gap-2 ${
                  location.pathname.startsWith('/dashboard') ? 'bg-[#A67B5B] text-[#FFF8F0]' : 'text-[#A67B5B]'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}

            <div className="flex items-center gap-6 ml-4 border-l border-[#FFF8F0]/10 pl-6">
              {isLoggedIn ? (
                <>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-[#FFDAB9] font-bold">
                      {userRole?.replace('_', ' ')}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-red-500/10 rounded-full text-red-400 hover:text-red-500 transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-[#FFF8F0]/70 hover:text-[#FFF8F0] transition-colors">Login</Link>
                  <Link to="/register" className="bg-[#A67B5B] hover:bg-[#8B654A] text-[#FFF8F0] px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#A67B5B]/20 hover:scale-[1.05]">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[#FFF8F0] p-2 bg-white/5 rounded-lg">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#2E1F13]/95 backdrop-blur-2xl text-[#FFF8F0] shadow-2xl py-8 flex flex-col items-center gap-6 border-t border-[#FFDAB9]/10">
          {customerLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} to={item.to} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-serif">
                {Icon && <Icon className="h-5 w-5 text-[#FFDAB9]" />}
                {item.label}
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="rounded-full bg-[#FFDAB9] px-2 py-0.5 text-xs font-bold text-[#2E1F13]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {isLoggedIn && !isCustomer && (
            <Link to={dashboardHome()} onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-serif text-[#FFDAB9] flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
          )}

          <div className="w-12 h-px bg-[#FFF8F0]/10 my-2"></div>

          {isLoggedIn ? (
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 font-bold">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-4 w-full px-8">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-3 border border-white/10 rounded-xl">Login</Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-3 bg-[#A67B5B] rounded-xl font-bold">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
