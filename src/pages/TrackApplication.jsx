import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, CheckCircle2, AlertCircle, Download, MessageSquare, FileText } from 'lucide-react';
import { getApplicationByTrackingId } from '../data/db';
import { useToast } from '../context/ToastContext';

export default function TrackApplication() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();
  
  const [searchId, setSearchId] = useState(searchParams.get('id') || '');
  const [application, setApplication] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      handleSearch(idParam);
    }
  }, [searchParams]);

  const handleSearch = async (trackingId) => {
    if (!trackingId.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const app = await getApplicationByTrackingId(trackingId.trim());
      setApplication(app);
      if (!app) {
        addToast('No application found with this tracking ID.', 'warning');
      }
    } catch (err) {
      console.error(err);
      addToast('Error searching application.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ id: searchId.trim() });
    handleSearch(searchId);
  };

  // Determine stage index
  // Tracking stages: 'Submitted', 'Documents Verified', 'Payment Verified', 'Processing', 'Completed', 'Rejected'
  const stages = ['Submitted', 'Documents Verified', 'Payment Verified', 'Processing', 'Completed'];
  const getStageIndex = (status) => {
    if (status === 'Rejected') return -1;
    return stages.indexOf(status);
  };

  const currentStageIndex = application ? getStageIndex(application.status) : 0;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 min-h-screen py-10 px-4 transition-colors">
      <div className="max-w-2xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center space-y-3 mb-8">
          <span className="text-xs font-bold text-blue-700 dark:text-blue-450 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/50 inline-block">Track Progress</span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
            Application Status Tracker
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs">
            Enter your Tracking ID to view the status of your online certificate or form application.
          </p>
        </div>

        {/* Search Box bar */}
        <form onSubmit={onSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex gap-3 mb-8 text-left transition-colors">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Enter Tracking ID (e.g. DJSK202612345)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-700/60 p-2.5 pl-11 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 uppercase tracking-wider font-bold transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 rounded-xl text-xs uppercase tracking-wide cursor-pointer transition shadow-sm"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="py-12 text-center flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Checking database status...</p>
          </div>
        )}

        {/* RESULTS RENDER */}
        {!loading && searched && (
          <>
            {application ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-8 shadow-md text-left transition-colors">
                
                {/* Header status details */}
                <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Application Type</p>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">{application.serviceName}</h3>
                    <p className="text-[10px] text-slate-500 font-semibold">Submitted: {new Date(application.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase mb-1">Status:</span>
                    <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                      application.status === 'Completed' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 border-emerald-200 dark:border-emerald-900/50' 
                        : application.status === 'Rejected'
                        ? 'bg-red-50 dark:bg-red-950/20 text-red-700 border-red-200 dark:border-red-900/50'
                        : 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 border-blue-200 dark:border-blue-900/50'
                    }`}>
                      {application.status}
                    </span>
                  </div>
                </div>

                {/* Progress bar stages */}
                {application.status !== 'Rejected' ? (
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Processing Stages (प्रगति के चरण):</h4>
                    
                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      {stages.map((stg, sIdx) => {
                        const isDone = sIdx <= currentStageIndex;
                        const isCurrent = sIdx === currentStageIndex;
                        return (
                          <div key={stg} className="flex md:flex-col items-center gap-3 md:gap-2 flex-1 w-full text-left md:text-center">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                              isDone 
                                ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20' 
                                : 'border-slate-300 dark:border-slate-700 text-slate-400'
                            }`}>
                              {isDone ? '✓' : sIdx + 1}
                            </div>
                            <div className="space-y-0.5">
                              <p className={`text-[11px] font-extrabold ${isDone ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                {stg}
                              </p>
                              {isCurrent && (
                                <span className="text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 font-extrabold px-1.5 py-0.5 rounded border border-amber-200/30 uppercase tracking-wider">Active</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* IF REJECTED display box */
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/55 rounded-2xl p-5 flex gap-3">
                    <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm text-red-900 dark:text-red-400">Application Rejected (आवेदन अस्वीकार कर दिया गया)</h4>
                      <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed font-semibold">
                        Reason: Please check the admin logs below. You may need to visit the shop or submit documents again.
                      </p>
                    </div>
                  </div>
                )}

                {/* Completed outputs downloader */}
                {application.status === 'Completed' && application.completedFiles && application.completedFiles.length > 0 && (
                  <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 p-5 rounded-2xl space-y-3.5">
                    <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-400 font-extrabold text-sm">
                      <CheckCircle2 size={18} />
                      <span>Download Final Slip / Document (दस्तावेज़ डाउनलोड करें):</span>
                    </div>
                    
                    <div className="space-y-2">
                      {application.completedFiles.map((file, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-emerald-600 dark:text-emerald-400" />
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-xs">{file.name}</span>
                          </div>
                          
                          <a
                            href={file.data}
                            download={file.name}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-1.5 px-3 rounded-lg text-[10px] uppercase tracking-wide transition flex items-center gap-1 shadow-sm"
                          >
                            <Download size={11} /> Download
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Logs / Chat update history */}
                <div className="space-y-4 border-t border-slate-100 dark:border-slate-800/80 pt-5">
                  <h4 className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <MessageSquare size={13} /> Status Updates & Logs (सन्देश लॉग):
                  </h4>
                  
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {application.messages && application.messages.map((msg, idx) => (
                      <div key={idx} className={`p-3 rounded-xl text-xs space-y-1 ${
                        msg.sender === 'System' 
                          ? 'bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800'
                          : 'bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/20'
                      }`}>
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-0.5">
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

                {/* Applicant Summary */}
                <div className="bg-slate-50 dark:bg-slate-950 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Applicant Full Name:</span>
                    <p className="font-extrabold text-slate-800 dark:text-slate-200">{application.fullName}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Mobile Number:</span>
                    <p className="font-extrabold text-slate-800 dark:text-slate-200">{application.phone}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Registered Email:</span>
                    <p className="font-extrabold text-slate-800 dark:text-slate-200">{application.email || 'N/A'}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Tracking ID:</span>
                    <p className="font-black text-blue-700 dark:text-blue-400 select-all">{application.trackingId}</p>
                  </div>
                </div>

              </div>
            ) : (
              /* Invalid tracking result display */
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-md text-center space-y-4 transition-colors">
                <AlertCircle className="text-amber-500 mx-auto" size={36} />
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Invalid Tracking ID</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    No application found matching <strong className="text-red-500 select-all">"{searchId}"</strong>. Please confirm you entered the ID correctly (e.g. DJSK202600001).
                  </p>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
