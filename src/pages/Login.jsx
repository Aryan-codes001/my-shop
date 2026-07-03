import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Key, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { login, register, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form input states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLoginMode) {
        // Login flow
        if (!formData.email || !formData.password) {
          addToast('Please fill in all fields (कृपया सभी फ़ील्ड भरें)', 'warning');
          setLoading(false);
          return;
        }
        await login(formData.email, formData.password);
        addToast('Welcome back! Login successful.', 'success');
        navigate('/dashboard');
      } else {
        // Registration flow
        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
          addToast('All fields are required for sign up.', 'warning');
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          addToast('Passwords do not match (पासवर्ड मेल नहीं खाते हैं)', 'warning');
          setLoading(false);
          return;
        }
        if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
          addToast('Please enter a valid 10-digit mobile number.', 'warning');
          setLoading(false);
          return;
        }
        
        await register(formData.name, formData.email, formData.phone, formData.password);
        addToast('Registration successful! Welcome aboard.', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Authentication failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 min-h-screen py-16 px-4 flex items-center justify-center transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md text-left transition-colors">
        
        {/* Banner header details */}
        <div className="bg-blue-900 text-white p-6 text-center space-y-1">
          <h2 className="text-xl font-black">Digital Service Portal Kiosk</h2>
          <p className="text-xs text-slate-350">
            {isLoginMode 
              ? 'Access your applications, track status, and get slips.' 
              : 'Create a portal account to view and submit applications.'}
          </p>
        </div>

        {/* Form elements */}
        <form onSubmit={handleAuthSubmit} className="p-6 md:p-8 space-y-4.5">
          
          {/* Name for Sign up */}
          {!isLoginMode && (
            <div className="space-y-1.5 text-xs">
              <label className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Full Name (पूरा नाम)</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={15} />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Rakesh Kumar"
                  className="w-full border border-slate-300 dark:border-slate-700 p-2.5 pl-10 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email input */}
          <div className="space-y-1.5 text-xs">
            <label className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Email Address (ईमेल)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={15} />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full border border-slate-300 dark:border-slate-700 p-2.5 pl-10 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors"
              />
            </div>
          </div>

          {/* Phone for Sign up */}
          {!isLoginMode && (
            <div className="space-y-1.5 text-xs">
              <label className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Mobile Number (मोबाइल नंबर)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-slate-400" size={15} />
                <input
                  type="tel"
                  name="phone"
                  required
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full border border-slate-300 dark:border-slate-700 p-2.5 pl-10 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Password input */}
          <div className="space-y-1.5 text-xs">
            <label className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Password (पासवर्ड)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={15} />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-slate-300 dark:border-slate-700 p-2.5 pl-10 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors"
              />
            </div>
          </div>

          {/* Confirm Password input */}
          {!isLoginMode && (
            <div className="space-y-1.5 text-xs">
              <label className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Confirm Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-3 text-slate-400" size={15} />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border border-slate-300 dark:border-slate-700 p-2.5 pl-10 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wide transition flex items-center justify-center gap-1 shadow-sm cursor-pointer disabled:opacity-50 mt-6"
          >
            <span>{loading ? 'Authenticating...' : isLoginMode ? 'Sign In' : 'Register Account'}</span>
            <ArrowRight size={13} />
          </button>
        </form>

        {/* Demo Account Callout */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850/60 border-t border-slate-150 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 space-y-1.5">
          <p className="font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert size={12} className="text-amber-500" /> Demo Credentials:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-medium leading-relaxed">
            <div>
              <strong className="text-slate-700 dark:text-slate-300">Admin Account:</strong> <br />
              • Email: <span className="underline">admin@djsk.com</span> <br />
              • Password: <span className="underline">admin123</span>
            </div>
            <div>
              <strong className="text-slate-700 dark:text-slate-300">Customer Account:</strong> <br />
              • Email: <span className="underline">customer@gmail.com</span> <br />
              • Password: <span className="underline">customer123</span>
            </div>
          </div>
        </div>

        {/* Toggle Mode Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-900/60 text-center border-t border-slate-150 dark:border-slate-800 text-xs font-semibold">
          {isLoginMode ? (
            <p className="text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <button 
                onClick={() => setIsLoginMode(false)}
                className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p className="text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <button 
                onClick={() => setIsLoginMode(true)}
                className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
