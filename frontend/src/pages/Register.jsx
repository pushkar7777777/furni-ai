import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ChevronRight, User, Briefcase, RefreshCw, Armchair } from 'lucide-react';
import { registerUser } from '../services/api';
import Background3D from '../components/Background3D';
import gsap from 'gsap';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '', confirmPassword: '', role: 'customer' });
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cleanedPhone = String(formData.phone || '').replace(/[\s\-().+]/g, '');
      if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(formData.email.trim())) {
        throw new Error('Email must be a valid gmail.com address');
      }
      if (!/^\d{10,15}$/.test(cleanedPhone)) {
        throw new Error('Phone number must contain only digits and be 10 to 15 digits long');
      }
      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      await registerUser(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to register account. Please try again.');
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
            <Link to="/" className="flex items-center gap-2 mb-10 group">
              <div className="p-3 bg-white/10 rounded-2xl group-hover:bg-white/20 transition-all">
                <Armchair className="w-6 h-6 text-[#FFF8F0]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FFF8F0]">Saikamal<span className="font-light italic text-[#FFDAB9]"> Furnitures</span></span>
            </Link>

            <h1 className="text-4xl font-serif font-bold mb-2 text-[#FFF8F0]">
              Join Us
            </h1>
            <p className="text-[#FFF8F0]/50 mb-8">Create your premium account today</p>
            
            {error && (
              <div className="bg-red-500/20 text-red-100 border border-red-500/30 text-sm p-4 rounded-2xl mb-6 backdrop-blur-md">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/80 transition-colors" />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full glass-input rounded-2xl pl-12 pr-4 py-3 placeholder-white/20 outline-none"
                  placeholder="Full Name"
                  required
                />
              </div>

              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/80 transition-colors" />
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full glass-input rounded-2xl pl-12 pr-4 py-3 placeholder-white/20 outline-none"
                  placeholder="Phone Number (digits only)"
                />
              </div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/80 transition-colors" />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full glass-input rounded-2xl pl-12 pr-4 py-3 placeholder-white/20 outline-none"
                  placeholder="Email Address (example@gmail.com)"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/80 transition-colors" />
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full glass-input rounded-2xl pl-12 pr-4 py-3 placeholder-white/20 outline-none"
                  placeholder="Create Password (min 8 chars)"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/80 transition-colors" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full glass-input rounded-2xl pl-12 pr-4 py-3 placeholder-white/20 outline-none"
                  placeholder="Confirm Password"
                  required
                />
              </div>

              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/80 transition-colors" />
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full glass-input rounded-2xl pl-12 pr-4 py-3 text-[#FFF8F0] focus:outline-none appearance-none cursor-pointer"
                  required
                >
                  <option value="customer" className="bg-[#2E1F13]">Customer</option>
                  <option value="staff" className="bg-[#2E1F13]">Staff</option>
                  <option value="inventory_manager" className="bg-[#2E1F13]">Inventory Manager</option>
                  <option value="admin" className="bg-[#2E1F13]">Admin</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#FFF8F0] text-[#2E1F13] hover:bg-[#FFDAB9] rounded-2xl py-4 font-bold transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 mt-2"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Create Account'}
                {!loading && <User className="w-5 h-5" />}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-[#FFF8F0]/40">
              Already possess an account? <Link to="/login" className="text-[#FFDAB9] font-bold hover:underline">Sign In</Link>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-1/2 relative bg-black/20">
          <div className="absolute inset-0 z-10 bg-gradient-to-l from-transparent to-[#0a0f0d]/40"></div>
          <img 
            src="https://images.unsplash.com/photo-1599619351208-3e6c839d6828?q=80&w=2000&auto=format&fit=crop" 
            alt="Craftmanship" 
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
          />
          <div className="absolute bottom-12 left-12 right-12 z-20">
            <div className="p-8 glass-panel rounded-3xl border-white/10">
              <p className="text-lg font-serif italic text-white/90 mb-4">"Artistry meets comfort in every piece."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Master Artistry</p>
                  <p className="text-xs text-white/40">Pure Perfection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
