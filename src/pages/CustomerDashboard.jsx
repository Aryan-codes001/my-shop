import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ClipboardList, CheckCircle2, AlertTriangle, 
  MessageSquare, Download, Bell, ExternalLink, Inbox, FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getApplicationsByUser, getNotifications, markNotificationRead } from '../data/db';

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);

  // Guard routing & load data
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role === 'admin') {
      navigate('/dashboard/admin'); // Admin route
      return;
    }

    async function loadDashboardData() {
      try {
        const apps = await getApplicationsByUser(user.email);
        setApplications(apps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        
        const notificationsList = await getNotifications(user.email);
        setNotifications(notificationsList);
        
        if (apps.length > 0) {
          setSelectedApp(apps[0]); // default select first application
        }
      } catch (err) {
        console.error(err);
        addToast('Error loading account records.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user, navigate, addToast]);

  const handleMarkNotification = async (notifId) => {
    try {
      await markNotificationRead(notifId);
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notifId ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Tracking Stages indices
  const stages = ['Submitted', 'Documents Verified', 'Payment Verified', 'Processing', 'Completed'];
  const getStageIndex = (status) => {
    if (status === 'Rejected') return -1;
    return stages.indexOf(status);
  };

  if (loading) {
    return (
      <div className="py-20 text-center bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500">Loading user dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 min-h-screen transition-colors">
      
      {/* Top Banner Bar */}
      <div className="bg-blue-900 text-white py-8 px-6 text-left shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black tracking-widest uppercase bg-blue-950 text-amber-400 px-3 py-1 rounded-full border border-blue-800">Customer Portal</span>
            <h2 className="text-xl md:text-2xl font-black">Welcome, {user.name}</h2>
            <p className="text-xs text-slate-300">Email: {user.email} | Phone: {user.phone}</p>
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="bg-slate-950/60 hover:bg-slate-950 hover:text-red-400 text-slate-300 text-xs font-bold py-2 px-5 rounded-xl border border-slate-800/80 transition cursor-pointer"
            >
              Sign Out (लॉग आउट)
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout dashboard */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 text-left items-start">
        
        {/* Left Side: Submitted list & notifications */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Recent Notifications Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Bell size={14} className="text-amber-500" />
              <span>Notifications Feed ({notifications.filter(n => !n.read).length})</span>
            </h3>

            {notifications.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs font-medium">
                No notification alerts.
              </div>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-3 rounded-xl border text-xs space-y-1 relative group cursor-pointer transition ${
                      notif.read 
                        ? 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-60' 
                        : 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40 font-bold'
                    }`}
                    onClick={() => !notif.read && handleMarkNotification(notif.id)}
                  >
                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                      <span>🔔 ALERT</span>
                      <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 leading-normal font-semibold">{notif.message}</p>
                    {!notif.read && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applications list */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <ClipboardList size={14} className="text-blue-500" />
              <span>Submitted Requests ({applications.length})</span>
            </h3>

            {applications.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs font-medium">
                No applications submitted yet. <br />
                <Link to="/apply" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">Apply for a service now</Link>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
                {applications.map((app) => {
                  const isSelected = selectedApp?.trackingId === app.trackingId;
                  return (
                    <button
                      key={app.trackingId}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex flex-col gap-2 ${
                        isSelected 
                          ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-500 shadow-sm' 
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => setSelectedApp(app)}
                    >
                      <div className="flex justify-between items-start w-full gap-2">
                        <span className="text-[10px] font-black text-blue-900 dark:text-blue-400 font-mono tracking-wider">{app.trackingId}</span>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                          app.status === 'Completed'
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 border-emerald-200 dark:border-emerald-900/50'
                            : app.status === 'Rejected'
                            ? 'bg-red-50 dark:bg-red-950/20 text-red-700 border-red-200 dark:border-red-900/50'
                            : 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 border-blue-200 dark:border-blue-900/50'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      
                      <div className="space-y-0.5">
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">{app.serviceName}</h4>
                        <p className="text-[9px] text-slate-400 font-semibold">{new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Selected Application Details Panel */}
        <div className="lg:col-span-8">
          {selectedApp ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-8 shadow-sm transition-colors">
              
              {/* Header metadata */}
              <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Tracking details for:</p>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white leading-tight">{selectedApp.serviceName}</h3>
                  <div className="flex gap-4 text-[10px] text-slate-500 font-semibold">
                    <span>ID: <strong className="text-slate-800 dark:text-white select-all font-mono">{selectedApp.trackingId}</strong></span>
                    <span>Date: {new Date(selectedApp.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <Link
                  to={`/track?id=${selectedApp.trackingId}`}
                  className="text-[10px] font-extrabold text-blue-650 hover:text-blue-700 bg-blue-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-slate-700 transition flex items-center gap-1"
                >
                  Public Tracker <ExternalLink size={11} />
                </Link>
              </div>

              {/* Progress Tracker representation */}
              {selectedApp.status !== 'Rejected' ? (
                <div className="space-y-3.5 text-xs text-left">
                  <h4 className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Processing Stages:</h4>
                  
                  <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {stages.map((stg, sIdx) => {
                      const isDone = sIdx <= getStageIndex(selectedApp.status);
                      return (
                        <div key={stg} className="flex sm:flex-col items-center gap-3 sm:gap-2 flex-1 w-full text-left sm:text-center">
                          <div className={`w-7.5 h-7.5 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                            isDone 
                              ? 'bg-blue-600 border-blue-600 text-white' 
                              : 'border-slate-350 dark:border-slate-700 text-slate-400'
                          }`}>
                            {isDone ? '✓' : sIdx + 1}
                          </div>
                          <div className="space-y-0.5">
                            <p className={`text-[10px] font-extrabold ${isDone ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                              {stg}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* REJECTED displays */
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-5 flex gap-3 text-left">
                  <AlertTriangle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-red-900 dark:text-red-400">Application Rejected</h4>
                    <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed font-semibold">
                      Reason: Refer to Ashok Kumar's comments in the message log below. You can submit another request or contact him.
                    </p>
                  </div>
                </div>
              )}

              {/* Download outputs */}
              {selectedApp.status === 'Completed' && selectedApp.completedFiles && selectedApp.completedFiles.length > 0 && (
                <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 p-5 rounded-2xl space-y-3 text-left">
                  <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wide">
                    <CheckCircle2 size={16} />
                    <span>Download Slip / Final Document:</span>
                  </div>
                  
                  <div className="space-y-2">
                    {selectedApp.completedFiles.map((file, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-emerald-600 dark:text-emerald-400" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-300 truncate max-w-xs">{file.name}</span>
                        </div>
                        
                        <a
                          href={file.data}
                          download={file.name}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-1.5 px-3.5 rounded-lg text-[10px] uppercase tracking-wide transition flex items-center gap-1 shadow-sm"
                        >
                          <Download size={11} /> Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message log threads */}
              <div className="space-y-4 border-t border-slate-100 dark:border-slate-800/85 pt-5 text-left">
                <h4 className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <MessageSquare size={13} />
                  <span>Communication History & Update Logs</span>
                </h4>
                
                <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                  {selectedApp.messages && selectedApp.messages.map((msg, idx) => (
                    <div key={idx} className={`p-3 rounded-xl text-xs space-y-1 ${
                      msg.sender === 'System' 
                        ? 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800'
                        : 'bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/20'
                    }`}>
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                        <span className={msg.sender === 'System' ? 'text-slate-500' : 'text-blue-600 dark:text-blue-400'}>
                          {msg.sender === 'System' ? '🤖 System Log' : '👤 Admin Message (अशोक कुमार)'}
                        </span>
                        <span>{new Date(msg.date).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">{msg.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Details Summary */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed text-left font-medium">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Applicant Name:</span>
                  <p className="font-extrabold text-slate-800 dark:text-slate-200">{selectedApp.fullName}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Mobile Phone:</span>
                  <p className="font-extrabold text-slate-800 dark:text-slate-200">{selectedApp.phone}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Submitted Address:</span>
                  <p className="font-extrabold text-slate-800 dark:text-slate-200 truncate">{selectedApp.address}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Estimated Cost:</span>
                  <p className="font-extrabold text-slate-800 dark:text-emerald-400">{selectedApp.price || '₹100'}</p>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
              <Inbox size={32} className="text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500 text-xs font-bold">Select an application from the left panel to inspect details.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
