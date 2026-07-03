import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, Sparkles, Menu, X, User, LogOut, Phone, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { BUSINESS_INFO } from '../data/businessData';

export default function Header() {
  const { darkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/apply', label: 'Online Apply' },
    { path: '/track', label: 'Track Application' },
    { path: '/studio', label: 'Digital Studio' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <div className="w-full z-50">
      {/* Top Banner Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800 dark:border-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-center md:text-left">
            <a href={`tel:${BUSINESS_INFO.phone}`} className="flex items-center gap-1 hover:text-white transition font-medium">
              <Phone size={12} className="text-blue-500" />
              <span>{BUSINESS_INFO.phone}</span>
            </a>
            <a 
              href={`https://wa.me/${BUSINESS_INFO.whatsapp.replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 hover:text-emerald-450 transition font-medium"
            >
              <MessageSquare size={12} className="text-emerald-500" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
          <div className="text-center font-bold text-[11px] md:text-xs text-amber-400 animate-pulse">
            ⚡ सभी ऑनलाइन सरकारी एवं बैंकिंग सेवाएं (Authorized CSC & Kiosk Center)
          </div>
          <div className="hidden md:block text-[11px] font-medium text-slate-400">
            Mon-Sat: 8:00 AM - 8:00 PM
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo / Branding */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="bg-blue-600 dark:bg-blue-700 text-white p-2 rounded-xl">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div className="text-left">
              <h1 className="text-base md:text-lg font-black tracking-tight text-blue-900 dark:text-blue-550 leading-none">
                Deep Jan Sewa Kendra
              </h1>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-extrabold block mt-0.5">
                & Deep Digital Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-300">
            {navLinks.map((link) => (
              <NavLink 
                key={link.path}
                to={link.path}
                className={({ isActive }) => 
                  `transition hover:text-blue-650 dark:hover:text-blue-400 ${isActive ? 'text-blue-650 dark:text-blue-400 font-extrabold border-b-2 border-blue-600 dark:border-blue-500 pb-1' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions & Theme Toggles */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button 
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              onClick={toggleTheme}
              aria-label="Toggle Theme Mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Dashboard / Auth Button */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link 
                  to="/dashboard" 
                  className="bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-slate-700 text-xs font-bold py-2 px-4 rounded-xl border border-blue-200/50 dark:border-slate-700 transition flex items-center gap-1.5"
                >
                  <User size={14} />
                  <span>Dashboard ({user.role === 'admin' ? 'Admin' : 'Portal'})</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-2 transition cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="hidden md:flex bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold py-2 px-4.5 rounded-xl shadow-md transition items-center gap-1.5 cursor-pointer"
              >
                <User size={14} />
                <span>Login / Register</span>
              </Link>
            )}

            {/* Mobile Nav Toggle */}
            <button 
              className="lg:hidden text-slate-700 dark:text-slate-200 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-3 px-4 flex flex-col gap-2 shadow-inner text-sm font-semibold animate-fade-in text-left">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className="py-2 px-2 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg transition text-slate-700 dark:text-slate-350"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Auth Links */}
            <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2">
              {user ? (
                <div className="space-y-2">
                  <div className="px-2 py-1 text-xs text-slate-500 dark:text-slate-400">
                    Logged in as: <strong className="text-slate-900 dark:text-slate-105">{user.name}</strong>
                  </div>
                  <Link 
                    to="/dashboard"
                    className="flex items-center gap-2 py-2 px-2 text-blue-750 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={16} /> Portal Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 py-2 px-2 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition text-left cursor-pointer"
                  >
                    <LogOut size={16} /> Logout (बाहर निकलें)
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login"
                  className="flex items-center gap-2 py-2.5 px-2 bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 rounded-lg transition font-bold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={16} /> Login / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Urgent Update Strip */}
      <div className="bg-amber-400 dark:bg-amber-500 text-slate-950 text-[11px] md:text-xs font-bold text-center py-2 px-4 border-b border-amber-500">
        📢 <span className="underline">ताज़ा अपडेट:</span> नए पैन कार्ड, आय-जाति-निवास प्रमाण पत्र, एवं छात्रवृत्ति (UP Scholarship) फॉर्म भरे जा रहे हैं।
      </div>
    </div>
  );
}
