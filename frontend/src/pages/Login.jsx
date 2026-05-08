import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ChevronRight, RefreshCw, Armchair } from 'lucide-react';
import { loginUser } from '../services/api';
import Background3D from '../components/Background3D';
import gsap from 'gsap';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const cardRef = useRef(null);

  useEffect(() => {
    // 3D Tilt Effect
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;

        gsap.to(card, {
            rotationY: x * 10,
            rotationX: -y * 10,
            transformPerspective: 1000,
            ease: "power2.out",
            duration: 0.5
        });
    };

    const handleMouseLeave = () => {
        gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            ease: "power2.out",
            duration: 0.5
        });
    };

    window.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginUser(formData);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_role', data.role);
      localStorage.setItem('user_id', data.userId);
      localStorage.setItem('user_email', data.email);
      localStorage.setItem('user_name', data.name || '');
      
      if (data.role === 'customer') {
        navigate('/products');
      } else if (data.role === 'inventory_manager') {
        navigate('/dashboard/inventory');
      } else if (data.role === 'staff') {
        navigate('/dashboard/notifications');
      } else {
        navigate('/dashboard/expense');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      <Background3D />
      
      <div 
        ref={cardRef}
        className="glass-card text-white rounded-[40px] flex max-w-5xl w-full h-[600px] overflow-hidden relative z-10"
      >
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center relative overflow-hidden">
          <div className="max-w-sm w-full mx-auto relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-12 group">
              <div className="p-3 bg-white/10 rounded-2xl group-hover:bg-white/20 transition-all">
                <Armchair className="w-6 h-6 text-[#FFF8F0]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FFF8F0]">Saikamal<span className="font-light italic text-[#FFDAB9]"> Furnitures</span></span>
            </Link>

            <h1 className="text-4xl font-serif font-bold mb-2 text-[#FFF8F0]">
              Welcome Back
            </h1>
            <p className="text-[#FFF8F0]/50 mb-8">Enter your credentials to access your account</p>
            
            {error && (
              <div className="bg-red-500/20 text-red-100 border border-red-500/30 text-sm p-4 rounded-2xl mb-6 backdrop-blur-md">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/80 transition-colors" />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full glass-input rounded-2xl pl-12 pr-4 py-4 placeholder-white/20 outline-none"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/80 transition-colors" />
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full glass-input rounded-2xl pl-12 pr-4 py-4 placeholder-white/20 outline-none"
                  placeholder="Password"
                  required
                />
              </div>

              <div className="flex justify-end text-sm">
                <Link to="/forgot-password" className="text-[#FFF8F0]/40 hover:text-[#FFDAB9] transition-colors">Forgot Password?</Link>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#FFF8F0] text-[#2E1F13] hover:bg-[#FFDAB9] rounded-2xl py-4 font-bold transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 mt-4"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Sign In'}
                {!loading && <ChevronRight className="w-5 h-5" />}
              </button>
            </form>

            <div className="mt-10 text-center text-sm text-[#FFF8F0]/40">
              New to our collection? <Link to="/register" className="text-[#FFDAB9] font-bold hover:underline">Create Account</Link>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-1/2 relative bg-black/20">
          <div className="absolute inset-0 z-10 bg-gradient-to-l from-transparent to-[#0a0f0d]/40"></div>
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
            alt="Interior" 
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
          />
          <div className="absolute bottom-12 left-12 right-12 z-20">
            <div className="p-8 glass-panel rounded-3xl border-white/10">
              <p className="text-lg font-serif italic text-white/90 mb-4">"Furniture is the jewelry of the home."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <Armchair className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Premium Collection</p>
                  <p className="text-xs text-white/40">Est. 1995</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
