import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Search, CheckCircle2, X, Download, 
  Upload, Send, Plus, Edit2, Trash2, Clock, Eye, 
  TrendingUp, RefreshCw, BarChart2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  getApplications, updateApplication, getServices, 
  addService, deleteService, getStudioBookings, addNotification 
} from '../data/db';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState('applications');

  // DB States
  const [applications, setApplications] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  // Selection States
  const [selectedApp, setSelectedApp] = useState(null);
  
  // Filters
  const [appSearch, setAppSearch] = useState('');
  const [appFilter, setAppFilter] = useState('All');

  // Preview Modal
  const [previewFile, setPreviewFile] = useState(null); // {name, data, type}
  
  // Admin message input
  const [adminMessage, setAdminMessage] = useState('');
  const [adminUploadedSlip, setAdminUploadedSlip] = useState(null);

  // Edit / Add Service states
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [isEditingService, setIsEditingService] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    id: '',
    name: '',
    category: 'Certificates',
    desc: '',
    processingTime: '',
    docs: '',
    price: ''
  });

  // Guard routing & load
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/dashboard'); // customer dashboard
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      const apps = await getApplications();
      setApplications(apps);
      
      const servs = await getServices();
      setServices(servs);
      
      const bks = await getStudioBookings();
      setBookings(bks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

      if (apps.length > 0) {
        setSelectedApp(apps[0]);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load database content.', 'error');
    }
  };

  // Convert File to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle upload of completed slip
  const handleSlipUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      addToast('File size exceeds 2MB limit.', 'warning');
      return;
    }

    try {
      const base64Data = await fileToBase64(file);
      setAdminUploadedSlip({
        name: file.name,
        data: base64Data
      });
      addToast('Slip file successfully loaded. Click Update to save.', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to parse file.', 'error');
    }
  };

  // Update Application
  const handleUpdateApplication = async (statusVal) => {
    if (!selectedApp) return;

    try {
      const updatedMessages = [...selectedApp.messages];
      
      // Handle status change
      let statusLogMsg = `Application status updated to: ${statusVal}`;
      if (statusVal !== selectedApp.status) {
        updatedMessages.push({
          sender: 'System',
          text: statusLogMsg,
          date: new Date().toISOString()
        });
      }

      // Handle custom text message
      if (adminMessage.trim()) {
        updatedMessages.push({
          sender: 'Admin',
          text: adminMessage.trim(),
          date: new Date().toISOString()
        });
      }

      // Handle slip upload
      const updatedSlips = [...(selectedApp.completedFiles || [])];
      if (adminUploadedSlip) {
        updatedSlips.push({
          name: adminUploadedSlip.name,
          data: adminUploadedSlip.data,
          uploadedAt: new Date().toISOString()
        });
      }

      const updated = {
        ...selectedApp,
        status: statusVal,
        messages: updatedMessages,
        completedFiles: updatedSlips
      };

      await updateApplication(updated);
      
      // Notify customer (if email available)
      if (selectedApp.email) {
        await addNotification({
          email: selectedApp.email,
          title: `Application Status: ${statusVal}`,
          message: `Your application for ${selectedApp.serviceName} is now ${statusVal}. ${
            adminMessage ? 'New message from admin: ' + adminMessage : ''
          }`,
          link: '/dashboard',
          trackingId: selectedApp.trackingId
        });
      }

      // Reset inputs
      setAdminMessage('');
      setAdminUploadedSlip(null);
      
      // Update local state lists
      setApplications(prev => 
        prev.map(a => a.trackingId === selectedApp.trackingId ? updated : a)
      );
      setSelectedApp(updated);

      addToast('Application updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to update application.', 'error');
    }
  };

  // SERVICES CRUD HANDLERS
  const handleOpenAddService = () => {
    setIsEditingService(false);
    setServiceForm({
      id: '',
      name: '',
      category: 'Certificates',
      desc: '',
      processingTime: '3-5 Days',
      docs: '',
      price: '₹100'
    });
    setServiceModalOpen(true);
  };

  const handleOpenEditService = (service) => {
    setIsEditingService(true);
    setServiceForm({
      id: service.id,
      name: service.name,
      category: service.category,
      desc: service.desc,
      processingTime: service.processingTime,
      docs: service.docs ? service.docs.join(', ') : '',
      price: service.price
    });
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!serviceForm.id || !serviceForm.name || !serviceForm.desc) {
      addToast('Please fill in Service ID, Name and Description.', 'warning');
      return;
    }

    try {
      const docsArray = serviceForm.docs 
        ? serviceForm.docs.split(',').map(s => s.trim()).filter(Boolean) 
        : [];
      
      const newServ = {
        id: serviceForm.id.trim(),
        name: serviceForm.name.trim(),
        category: serviceForm.category,
        desc: serviceForm.desc.trim(),
        processingTime: serviceForm.processingTime.trim(),
        docs: docsArray,
        price: serviceForm.price.trim()
      };

      await addService(newServ);
      
      // Refresh list
      const list = await getServices();
      setServices(list);
      
      setServiceModalOpen(false);
      addToast(`Service saved successfully!`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to save service.', 'error');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
      addToast('Service removed.', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to delete service.', 'error');
    }
  };

  // Calculations for analytics overview
  const totalAppsCount = applications.length;
  const pendingPaymentsCount = applications.filter(a => a.status === 'Submitted').length;
  const completedAppsCount = applications.filter(a => a.status === 'Completed').length;
  
  const totalEarnings = applications
    .filter(a => a.status === 'Completed')
    .reduce((sum, a) => {
      const priceNum = parseInt(a.price?.replace(/[^0-9]/g, '') || '0', 10);
      return sum + (isNaN(priceNum) ? 0 : priceNum);
    }, 0);

  // Application search filter
  const filteredApps = applications.filter(app => {
    const matchesSearch = app.fullName.toLowerCase().includes(appSearch.toLowerCase()) || 
                          app.trackingId.toLowerCase().includes(appSearch.toLowerCase()) ||
                          app.serviceName.toLowerCase().includes(appSearch.toLowerCase());
    const matchesFilter = appFilter === 'All' || app.status === appFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 min-h-screen transition-colors text-left font-sans">
      
      {/* Top administrative bar */}
      <div className="bg-slate-900 text-white py-6 px-6 shadow-sm border-b border-slate-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black tracking-widest uppercase bg-blue-700 text-white px-3 py-1 rounded-full border border-blue-600">Admin Console</span>
            <span className="text-[10px] font-black tracking-widest uppercase bg-slate-800 text-slate-400 px-3 py-1 rounded-full">Secure Session</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">Ashok Kumar's Dashboard</h2>
          <p className="text-xs text-slate-400">Manage Deep Jan Sewa Kendra applications, pricing lists & photography bookings.</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={loadData}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700/60 transition cursor-pointer"
            title="Refresh database"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={logout}
            className="bg-red-650 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition cursor-pointer flex items-center gap-1 shadow-md"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
        
        {/* ANALYTICS SECTION */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 p-3.5 rounded-xl">
              <BarChart2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Applications</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{totalAppsCount}</h4>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl shadow-xs flex items-center gap-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 p-3.5 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pending Review</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{pendingPaymentsCount}</h4>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl shadow-xs flex items-center gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-3.5 rounded-xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Completed Jobs</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{completedAppsCount}</h4>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl shadow-xs flex items-center gap-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-750 dark:text-indigo-400 p-3.5 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gross Income</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">₹{totalEarnings}</h4>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex border-b border-slate-200 dark:border-slate-855 gap-2.5 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('applications')}
            className={`py-3 px-4 transition border-b-2 cursor-pointer ${
              activeTab === 'applications' 
                ? 'border-blue-600 text-blue-650 dark:text-blue-400 font-extrabold' 
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            📂 Applications ({applications.length})
          </button>
          
          <button
            onClick={() => setActiveTab('services')}
            className={`py-3 px-4 transition border-b-2 cursor-pointer ${
              activeTab === 'services' 
                ? 'border-blue-600 text-blue-650 dark:text-blue-400 font-extrabold' 
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            ⚙️ Manage Services ({services.length})
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3 px-4 transition border-b-2 cursor-pointer ${
              activeTab === 'bookings' 
                ? 'border-blue-600 text-blue-650 dark:text-blue-400 font-extrabold' 
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            📸 Studio Inquiries ({bookings.length})
          </button>
        </div>

        {/* TAB CONTENT: APPLICATIONS LIST */}
        {activeTab === 'applications' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left applications list */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-4 rounded-2xl shadow-xs space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-slate-400" size={15} />
                    <input
                      type="text"
                      placeholder="Search name / ID..."
                      value={appSearch}
                      onChange={(e) => setAppSearch(e.target.value)}
                      className="w-full border border-slate-200 dark:border-slate-800 p-2 pl-9 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  
                  <select
                    value={appFilter}
                    onChange={(e) => setAppFilter(e.target.value)}
                    className="border border-slate-200 dark:border-slate-800 p-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-bold"
                  >
                    <option value="All">All Status</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Documents Verified">Docs Verified</option>
                    <option value="Payment Verified">Payment Verified</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                  {filteredApps.length === 0 ? (
                    <p className="py-12 text-center text-xs text-slate-500 font-bold">No application match found.</p>
                  ) : (
                    filteredApps.map((app) => {
                      const isSelected = selectedApp?.trackingId === app.trackingId;
                      return (
                        <button
                          key={app.trackingId}
                          onClick={() => {
                            setSelectedApp(app);
                            setAdminUploadedSlip(null);
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border transition flex justify-between items-start ${
                            isSelected 
                              ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-550 shadow-xs' 
                              : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-850'
                          }`}
                        >
                          <div className="space-y-1.5 truncate flex-1 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black text-blue-800 dark:text-blue-400 font-mono tracking-wider">{app.trackingId}</span>
                              <span className="text-[9px] text-slate-400 font-semibold">{new Date(app.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">{app.fullName}</h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{app.serviceName}</p>
                          </div>
                          
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                            app.status === 'Completed'
                              ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 border-emerald-250 dark:border-emerald-900/50'
                              : app.status === 'Rejected'
                              ? 'bg-red-50 dark:bg-red-950/20 text-red-750 border-red-250 dark:border-red-900/50'
                              : 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 border-blue-200 dark:border-blue-900/50'
                          }`}>
                            {app.status}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right Application Details */}
            <div className="lg:col-span-7">
              {selectedApp ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs">
                  
                  {/* Title Header */}
                  <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-850 pb-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Selected Request Details:</p>
                      <h3 className="font-black text-base text-slate-905 dark:text-white leading-tight">{selectedApp.serviceName}</h3>
                      <p className="text-[10px] font-semibold text-slate-400">Tracking ID: <span className="font-mono text-slate-700 dark:text-slate-300 font-bold select-all">{selectedApp.trackingId}</span></p>
                    </div>
                    
                    <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 px-3 py-1 rounded border border-blue-200 dark:border-blue-900/50">
                      Charge: {selectedApp.price}
                    </span>
                  </div>

                  {/* Personal details info list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-relaxed border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <strong className="text-slate-400 font-semibold block text-[10px] uppercase">Applicant Name:</strong>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{selectedApp.fullName}</span>
                    </div>
                    <div>
                      <strong className="text-slate-400 font-semibold block text-[10px] uppercase">Father's Name:</strong>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{selectedApp.fatherName || 'N/A'}</span>
                    </div>
                    <div>
                      <strong className="text-slate-400 font-semibold block text-[10px] uppercase">Mother's Name:</strong>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{selectedApp.motherName || 'N/A'}</span>
                    </div>
                    <div>
                      <strong className="text-slate-400 font-semibold block text-[10px] uppercase">Mobile Number:</strong>
                      <a href={`tel:${selectedApp.phone}`} className="font-bold text-blue-600 dark:text-blue-400 hover:underline">{selectedApp.phone}</a>
                    </div>
                    <div>
                      <strong className="text-slate-400 font-semibold block text-[10px] uppercase">Email:</strong>
                      <span className="font-bold text-slate-850 dark:text-slate-200">{selectedApp.email || 'N/A'}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <strong className="text-slate-400 font-semibold block text-[10px] uppercase">Address:</strong>
                      <span className="font-bold text-slate-850 dark:text-slate-200">{selectedApp.address}</span>
                    </div>
                    {selectedApp.aadhaar && (
                      <div>
                        <strong className="text-slate-400 font-semibold block text-[10px] uppercase">Aadhaar No:</strong>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-350">{selectedApp.aadhaar}</span>
                      </div>
                    )}
                    {selectedApp.pan && (
                      <div>
                        <strong className="text-slate-400 font-semibold block text-[10px] uppercase">PAN Card No:</strong>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-350 uppercase">{selectedApp.pan}</span>
                      </div>
                    )}
                  </div>

                  {/* Documents Display */}
                  <div className="space-y-2 border-b border-slate-100 dark:border-slate-850 pb-4">
                    <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wide">Applicant Uploads:</h4>
                    
                    <div className="flex flex-wrap gap-2.5 text-xs">
                      {/* Document file links */}
                      {selectedApp.documents && selectedApp.documents.map((doc, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPreviewFile({ name: doc.name, data: doc.data, type: doc.type })}
                          className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 cursor-pointer max-w-[200px]"
                        >
                          <Eye size={13} className="text-blue-500" />
                          <span className="font-bold text-[10px] truncate">{doc.name}</span>
                        </button>
                      ))}
                      
                      {/* Payment Proof Screenshot button */}
                      {selectedApp.paymentProof && (
                        <button
                          onClick={() => setPreviewFile({ name: 'Payment Proof Screenshot', data: selectedApp.paymentProof, type: 'image/' })}
                          className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-150 dark:border-emerald-900/40 flex items-center gap-1.5 cursor-pointer text-emerald-800 dark:text-emerald-400"
                        >
                          <Eye size={13} />
                          <span className="font-extrabold text-[10px]">Payment Proof Screen</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Change Status & Upload file Action Box */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-850 space-y-4">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-300">Update Request Action</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Change Status</label>
                        <select
                          id="admin-status-select"
                          value={selectedApp.status}
                          onChange={(e) => handleUpdateApplication(e.target.value)}
                          className="w-full border border-slate-300 dark:border-slate-700 p-2 rounded-xl text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold"
                        >
                          <option value="Submitted">Submitted (प्राप्त)</option>
                          <option value="Documents Verified">Documents Verified (कागजात सत्यापित)</option>
                          <option value="Payment Verified">Payment Verified (भुगतान सत्यापित)</option>
                          <option value="Processing">Processing (प्रगति पर)</option>
                          <option value="Completed">Completed (पूर्ण)</option>
                          <option value="Rejected">Rejected (अस्वीकृत)</option>
                        </select>
                      </div>

                      {/* Completed PDF/Slip file upload */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Upload Final PDF / Certificate</label>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            id="admin-completed-file"
                            className="hidden"
                            onChange={handleSlipUpload}
                          />
                          <label
                            htmlFor="admin-completed-file"
                            className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow-xs w-full justify-center"
                          >
                            <Upload size={13} /> Upload Slip
                          </label>
                        </div>
                        {adminUploadedSlip && (
                          <span className="text-[9px] font-extrabold text-emerald-600 block mt-1 truncate">{adminUploadedSlip.name} loaded</span>
                        )}
                      </div>
                    </div>

                    {/* Messages box input */}
                    <div className="space-y-1.5 text-xs">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Send Message / Reason to Customer</label>
                      <div className="flex gap-2">
                        <textarea
                          rows={2}
                          placeholder="Provide explanation, missing documents note, or completion congrats..."
                          value={adminMessage}
                          onChange={(e) => setAdminMessage(e.target.value)}
                          className="w-full border border-slate-300 dark:border-slate-700 p-2 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleUpdateApplication(selectedApp.status)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 px-6 rounded-xl text-xs uppercase tracking-wide transition flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <Send size={12} /> Save Updates & Notify
                      </button>
                    </div>
                  </div>

                  {/* Previous communication list logs */}
                  <div className="space-y-3.5 border-t border-slate-105 dark:border-slate-805 pt-4 text-xs">
                    <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wide">Communication logs:</h4>
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {selectedApp.messages && selectedApp.messages.map((msg, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-105 dark:border-slate-850">
                          <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 mb-0.5">
                            <span>{msg.sender === 'System' ? '🤖 System Log' : '👤 Admin (Ashok)'}</span>
                            <span>{new Date(msg.date).toLocaleString()}</span>
                          </div>
                          <p className="font-semibold text-slate-700 dark:text-slate-300">{msg.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-xs">
                  <Eye size={30} className="text-slate-350 mx-auto mb-2" />
                  <p className="text-slate-500 text-xs font-bold">Select application to review files, pay screenshots, and update stages.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: SERVICES CATALOG MANAGER */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-950 dark:text-white">Services Catalog Configurator</h3>
              
              <button
                onClick={handleOpenAddService}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition flex items-center gap-1 cursor-pointer shadow-md"
              >
                <Plus size={14} /> Add New Service
              </button>
            </div>

            {/* List and CRUD actions table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-medium text-slate-650 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-4 px-6 text-left">ID</th>
                      <th className="py-4 px-6 text-left">Service Name</th>
                      <th className="py-4 px-6 text-left">Category</th>
                      <th className="py-4 px-6 text-left">Time</th>
                      <th className="py-4 px-6 text-left">Price</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {services.map((serv) => (
                      <tr key={serv.id} className="hover:bg-slate-50 dark:hover:bg-slate-850 transition">
                        <td className="py-4 px-6 font-mono font-bold text-slate-800 dark:text-slate-400">{serv.id}</td>
                        <td className="py-4 px-6 font-bold text-slate-900 dark:text-white max-w-xs truncate">{serv.name}</td>
                        <td className="py-4 px-6">
                          <span className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-150 dark:border-blue-900/50 text-[9px] uppercase tracking-wide font-black">
                            {serv.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-semibold">{serv.processingTime}</td>
                        <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white">{serv.price}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenEditService(serv)}
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 p-2 rounded-lg transition cursor-pointer"
                              title="Edit service details"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteService(serv.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 p-2 rounded-lg transition cursor-pointer"
                              title="Remove service"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: STUDIO BOOKINGS & CONTACTS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-950 dark:text-white">Photography Bookings & Inquiries Log</h3>
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
              {bookings.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-xs font-bold">No studio booking inquiries recorded in system.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-medium text-slate-650 dark:text-slate-350">
                    <thead className="bg-slate-50 dark:bg-slate-955 text-slate-505 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-4 px-6 text-left">Date Logged</th>
                        <th className="py-4 px-6 text-left">Customer Name</th>
                        <th className="py-4 px-6 text-left">Mobile Number</th>
                        <th className="py-4 px-6 text-left">Request Type</th>
                        <th className="py-4 px-6 text-left">Event Date / Shoot Details</th>
                        <th className="py-4 px-6 text-left">Location / Message</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {bookings.map((bk) => (
                        <tr key={bk.id} className="hover:bg-slate-50 dark:hover:bg-slate-850 transition">
                          <td className="py-4 px-6 font-semibold">{new Date(bk.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{bk.name}</td>
                          <td className="py-4 px-6 font-semibold">
                            <a href={`tel:${bk.phone}`} className="text-blue-600 dark:text-blue-450 hover:underline">{bk.phone}</a>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                              bk.type === 'booking' 
                                ? 'bg-pink-50 dark:bg-pink-950/20 text-pink-700 border-pink-200 dark:border-pink-900/50' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 border-slate-250 dark:border-slate-700'
                            }`}>
                              {bk.type === 'booking' ? 'Studio Booking' : 'Contact Query'}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-semibold text-slate-850 dark:text-slate-250">
                            {bk.type === 'booking' ? (
                              <span>📅 Shoot: <strong className="underline">{bk.eventDate}</strong> <br /> ({bk.shootType})</span>
                            ) : (
                              <span>General Service: <strong className="underline">{bk.service}</strong></span>
                            )}
                          </td>
                          <td className="py-4 px-6 max-w-xs leading-relaxed truncate-3-lines">
                            {bk.type === 'booking' && bk.location && <p className="font-semibold mb-0.5">📍 Location: {bk.location}</p>}
                            <span className="text-slate-500 italic">"{bk.notes}"</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* FILE PREVIEW MODAL LIGHTBOX */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-5 max-h-[90vh] overflow-y-auto relative animate-scale-up">
            
            <button
              onClick={() => setPreviewFile(null)}
              className="absolute top-4 right-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 p-2 rounded-xl transition cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
              aria-label="Close Preview"
            >
              <X size={16} />
            </button>

            <h3 className="font-extrabold text-sm border-b border-slate-100 dark:border-slate-850 pb-2 mb-4 text-slate-900 dark:text-white truncate">
              File Preview: {previewFile.name}
            </h3>

            {/* Render Preview by file format */}
            <div className="flex justify-center bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[300px]">
              {previewFile.data.startsWith('data:image/') || previewFile.type.startsWith('image/') ? (
                <img 
                  src={previewFile.data} 
                  alt={previewFile.name} 
                  className="max-h-[60vh] object-contain rounded-xl"
                />
              ) : previewFile.data.startsWith('data:application/pdf') ? (
                /* PDF previewer helper using embedded object tags */
                <object 
                  data={previewFile.data} 
                  type="application/pdf" 
                  width="100%" 
                  height="500px"
                  className="rounded-xl border border-slate-305"
                >
                  <div className="flex flex-col items-center justify-center p-12 text-center text-xs space-y-4">
                    <FileText size={48} className="text-slate-400" />
                    <p className="font-bold text-slate-700 dark:text-slate-300">PDF preview is not supported by your browser.</p>
                    <a
                      href={previewFile.data}
                      download={previewFile.name}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 px-5 rounded-xl text-xs uppercase tracking-wide transition shadow-sm inline-flex items-center gap-1"
                    >
                      <Download size={13} /> Download PDF to view
                    </a>
                  </div>
                </object>
              ) : (
                /* Fallback download options */
                <div className="flex flex-col items-center justify-center p-12 text-center text-xs space-y-4">
                  <FileText size={48} className="text-slate-400" />
                  <p className="font-bold text-slate-700 dark:text-slate-300">Preview not available for this format.</p>
                  <a
                    href={previewFile.data}
                    download={previewFile.name}
                    className="bg-blue-650 hover:bg-blue-700 text-white font-extrabold py-2 px-5 rounded-xl text-xs uppercase tracking-wide transition shadow-sm inline-flex items-center gap-1"
                  >
                    <Download size={13} /> Download File
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 gap-2">
              <a
                href={previewFile.data}
                download={previewFile.name}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 px-5 rounded-xl text-xs uppercase tracking-wide transition shadow-sm inline-flex items-center gap-1"
              >
                <Download size={13} /> Download
              </a>
              <button
                onClick={() => setPreviewFile(null)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold py-2 px-5 rounded-xl text-xs uppercase tracking-wide transition border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE EDIT/ADD DYNAMIC MODAL */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-5 shadow-lg relative animate-scale-up">
            
            <button
              onClick={() => setServiceModalOpen(false)}
              className="absolute top-4 right-4 bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300 p-2 rounded-xl transition cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <X size={16} />
            </button>

            <h3 className="font-extrabold text-base border-b border-slate-100 dark:border-slate-850 pb-2 mb-4 text-slate-900 dark:text-white">
              {isEditingService ? 'Edit Service Details' : 'Add New Portal Service'}
            </h3>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Service Unique ID *</label>
                  <input
                    type="text"
                    disabled={isEditingService}
                    className="w-full border border-slate-300 dark:border-slate-700 p-2 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 disabled:opacity-60"
                    placeholder="e.g. cert-income-new"
                    value={serviceForm.id}
                    onChange={(e) => setServiceForm({ ...serviceForm, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Category *</label>
                  <select
                    className="w-full border border-slate-300 dark:border-slate-700 p-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-bold"
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                  >
                    <option value="Certificates">Certificates</option>
                    <option value="Registrations">Registrations</option>
                    <option value="Education">Education</option>
                    <option value="Utility">Utility</option>
                    <option value="Cyber Cafe">Cyber Cafe</option>
                    <option value="Photography">Photography</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Service Name *</label>
                <input
                  type="text"
                  className="w-full border border-slate-300 dark:border-slate-700 p-2 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                  placeholder="e.g. Income Certificate (आय प्रमाण पत्र)"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Description *</label>
                <textarea
                  rows={2}
                  className="w-full border border-slate-300 dark:border-slate-700 p-2 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                  placeholder="Summarize the service scope..."
                  value={serviceForm.desc}
                  onChange={(e) => setServiceForm({ ...serviceForm, desc: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Processing Time</label>
                  <input
                    type="text"
                    className="w-full border border-slate-300 dark:border-slate-700 p-2 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                    placeholder="e.g. 5-7 Days"
                    value={serviceForm.processingTime}
                    onChange={(e) => setServiceForm({ ...serviceForm, processingTime: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Price Tag (Estimated Fee)</label>
                  <input
                    type="text"
                    className="w-full border border-slate-300 dark:border-slate-700 p-2 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                    placeholder="e.g. ₹100"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Required Documents (comma separated)</label>
                <input
                  type="text"
                  className="w-full border border-slate-300 dark:border-slate-700 p-2 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                  placeholder="e.g. Aadhaar Card, Photo, Self Declaration"
                  value={serviceForm.docs}
                  onChange={(e) => setServiceForm({ ...serviceForm, docs: e.target.value })}
                />
                <span className="text-[9px] text-slate-400 block mt-1">Separate documents using commas. Example: Aadhaar Card, Passport Photo, Marksheet</span>
              </div>

              <div className="flex justify-end pt-4 gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 px-6 rounded-xl text-xs uppercase tracking-wide transition shadow-sm cursor-pointer"
                >
                  Save Service
                </button>
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold py-2 px-5 rounded-xl text-xs uppercase tracking-wide transition border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
