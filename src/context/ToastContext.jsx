import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';
          
          let bgColor = 'bg-slate-900 dark:bg-slate-800 text-slate-100';
          let icon = <Info size={16} className="text-blue-400" />;
          let borderColor = 'border-slate-800 dark:border-slate-700';

          if (isSuccess) {
            bgColor = 'bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-100';
            icon = <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />;
            borderColor = 'border-emerald-200 dark:border-emerald-800';
          } else if (isError) {
            bgColor = 'bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-100';
            icon = <AlertCircle size={16} className="text-red-600 dark:text-red-400" />;
            borderColor = 'border-red-200 dark:border-red-800';
          } else if (isWarning) {
            bgColor = 'bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-100';
            icon = <AlertCircle size={16} className="text-amber-600 dark:text-amber-400" />;
            borderColor = 'border-amber-200 dark:border-amber-800';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto border flex items-start gap-3 p-4 rounded-xl shadow-lg transition-all duration-350 transform translate-y-0 animate-slide-in ${bgColor} ${borderColor}`}
            >
              <div className="mt-0.5 flex-shrink-0">{icon}</div>
              <div className="flex-1 text-xs font-semibold leading-relaxed whitespace-pre-line">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-650 cursor-pointer p-0.5"
                aria-label="Close Notification"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
