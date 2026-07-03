import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Global Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';

// Database Initialization
import { initializeDatabase } from './data/db';

// Global Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

// Core Pages
import Home from './pages/Home';
import Services from './pages/Services';
import OnlineApply from './pages/OnlineApply';
import TrackApplication from './pages/TrackApplication';
import DigitalStudio from './pages/DigitalStudio';
import Login from './pages/Login';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Dashboard Router Switch helper (redirects logged in users to correct dashboards)
function UnifiedDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center min-h-[50vh] gap-2">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-semibold">Loading portal session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/dashboard/admin" replace />;
  }

  return <CustomerDashboard />;
}

// Inner App component to handle DB initialization on boot
function AppContent() {
  const { addToast } = useToast();
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function bootDB() {
      try {
        await initializeDatabase();
        setDbReady(true);
      } catch (err) {
        console.error('Failed to initialize database:', err);
        addToast('Database initialization error (डेटाबेस लोड विफलता)', 'error');
      }
    }
    bootDB();
  }, [addToast]);

  if (!dbReady) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-700 dark:text-slate-350 gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center space-y-1">
          <p className="font-extrabold text-sm text-slate-905 dark:text-white uppercase tracking-wider">Deep Jan Sewa Kendra</p>
          <p className="text-xs text-slate-500">Starting secure digital client database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans transition-colors duration-200">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/contact" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/apply" element={<OnlineApply />} />
          <Route path="/track" element={<TrackApplication />} />
          <Route path="/studio" element={<DigitalStudio />} />
          <Route path="/login" element={<Login />} />
          
          {/* Dashboards */}
          <Route path="/dashboard" element={<UnifiedDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          
          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
