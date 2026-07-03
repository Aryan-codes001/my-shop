import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  FileText, Upload, ShieldCheck, QrCode, CreditCard, 
  ArrowRight, ArrowLeft, CheckCircle2, 
  AlertTriangle, ClipboardList, Info, Trash2
} from 'lucide-react';
import { getServices, addApplication, addNotification } from '../data/db';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function OnlineApply() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addToast } = useToast();

  const preselectedServiceId = searchParams.get('service') || '';
  
  // Database states
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    serviceId: '',
    fullName: user?.name || '',
    fatherName: '',
    motherName: '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    aadhaar: '',
    pan: '',
    notes: ''
  });

  // Files upload states
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [paymentProof, setPaymentProof] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdTrackingId, setCreatedTrackingId] = useState('');

  // Step state
  const [currentStep, setCurrentStep] = useState(1);

  // Load services
  useEffect(() => {
    async function loadData() {
      const data = await getServices();
      // Filter out banking services from online form list (requires physical visit)
      const formServices = data.filter(s => s.category !== 'Banking');
      setServices(formServices);
      
      if (preselectedServiceId) {
        const found = formServices.find(s => s.id === preselectedServiceId);
        if (found) {
          setSelectedService(found);
          setFormData(prev => ({ ...prev, serviceId: found.id }));
        }
      }
    }
    loadData();
  }, [preselectedServiceId]);

  // Update selection details when ID changes
  const handleServiceChange = (e) => {
    const val = e.target.value;
    const found = services.find(s => s.id === val);
    setSelectedService(found || null);
    setFormData(prev => ({ ...prev, serviceId: val }));
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

  // Handle document upload
  const handleDocUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    for (const file of files) {
      const isPdf = file.type === 'application/pdf';
      const isImg = file.type.startsWith('image/');
      
      if (!isPdf && !isImg) {
        addToast(`Unsupported file type: ${file.name}. Please upload PDF, JPG or PNG.`, 'warning');
        continue;
      }

      // Check size (2MB limit for client side storage)
      if (file.size > 2 * 1024 * 1024) {
        addToast(`File ${file.name} is too large. Max size is 2MB (2एमबी से कम फाइल अपलोड करें)`, 'warning');
        continue;
      }

      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [file.name]: 10 }));
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[file.name] || 0;
          if (current >= 100) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, [file.name]: current + 30 };
        });
      }, 150);

      try {
        const base64Data = await fileToBase64(file);
        
        setTimeout(() => {
          setUploadedDocs(prev => [...prev, {
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            type: file.type,
            data: base64Data
          }]);
          addToast(`Uploaded ${file.name} successfully`, 'success');
        }, 600);
        
      } catch (err) {
        console.error('File conversion error:', err);
        addToast(`Failed to upload ${file.name}`, 'error');
      }
    }
  };

  // Delete uploaded document
  const deleteDoc = (index) => {
    setUploadedDocs(prev => prev.filter((_, i) => i !== index));
  };

  // Handle Payment Screenshot Upload
  const handlePaymentProofUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImg = file.type.startsWith('image/');
    if (!isImg) {
      addToast('Please upload payment screenshot as PNG or JPG.', 'warning');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      addToast('Screenshot exceeds 2MB limit.', 'warning');
      return;
    }

    try {
      const base64Data = await fileToBase64(file);
      setPaymentProof({
        name: file.name,
        data: base64Data
      });
      addToast('Payment proof screenshot loaded', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to parse screenshot', 'error');
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.serviceId) {
        addToast('Please select a service (कृपया सेवा का चयन करें)', 'warning');
        return;
      }
      if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
        addToast('Please fill in Name, Phone, and Address (नाम, फोन और पता आवश्यक है)', 'warning');
        return;
      }
      if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
        addToast('Please enter a valid 10-digit mobile number.', 'warning');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Document step check
      if (selectedService?.docs && selectedService.docs.length > 0 && uploadedDocs.length === 0) {
        addToast('Uploading at least 1 document is recommended.', 'info');
      }
      setCurrentStep(3);
    }
  };

  // Form Submission
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!paymentProof) {
      addToast('Please upload the UPI payment screenshot (पेमेंट स्क्रीनशॉट अपलोड करना आवश्यक है)', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate tracking ID
      const randomPart = Math.floor(10000 + Math.random() * 90000);
      const trackingId = `DJSK2026${randomPart}`;

      const application = {
        trackingId,
        serviceId: formData.serviceId,
        serviceName: selectedService ? selectedService.name : 'Unknown Service',
        category: selectedService ? selectedService.category : 'General',
        fullName: formData.fullName,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        aadhaar: formData.aadhaar,
        pan: formData.pan,
        notes: formData.notes,
        documents: uploadedDocs,
        paymentProof: paymentProof.data,
        status: 'Submitted',
        messages: [
          { sender: 'System', text: 'Application submitted successfully. Awaiting payment and document verification.', date: new Date().toISOString() }
        ],
        createdAt: new Date().toISOString(),
        completedFiles: [],
        price: selectedService?.price || '₹100'
      };

      // Add to IndexedDB
      await addApplication(application);

      // Create Admin notification
      await addNotification({
        email: 'admin@djsk.com',
        title: 'New Online Form Application',
        message: `New request for ${application.serviceName} submitted by ${application.fullName}. Tracking ID: ${trackingId}`,
        link: '/dashboard',
        trackingId
      });

      // Create Customer notification (if email matches customer account)
      if (formData.email) {
        await addNotification({
          email: formData.email,
          title: 'Application Received',
          message: `Your application for ${application.serviceName} has been received. Track status using ID: ${trackingId}`,
          link: '/track',
          trackingId
        });
      }

      setCreatedTrackingId(trackingId);
      setSubmitSuccess(true);
      addToast('Application submitted successfully!', 'success');
      
    } catch (err) {
      console.error(err);
      addToast('Failed to submit application. Try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 min-h-screen py-10 px-4 transition-colors">
      <div className="max-w-3xl mx-auto">
        
        {/* Main Application flow */}
        {!submitSuccess ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md text-left transition-colors">
            {/* Step Wizard Header */}
            <div className="bg-blue-900 text-white p-6 relative">
              <h2 className="text-xl md:text-2xl font-black">Online Application System</h2>
              <p className="text-xs text-slate-300 mt-1">Submit documents and process payments securely in 3 steps.</p>
              
              {/* Progress Steps Indicators */}
              <div className="flex items-center gap-2 mt-6 text-xs font-bold uppercase tracking-wider">
                <div className={`flex items-center gap-1.5 ${currentStep >= 1 ? 'text-amber-400' : 'text-slate-400'}`}>
                  <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px]">1</span>
                  <span>Details</span>
                </div>
                <div className="flex-1 h-0.5 bg-slate-700" />
                <div className={`flex items-center gap-1.5 ${currentStep >= 2 ? 'text-amber-400' : 'text-slate-400'}`}>
                  <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px]">2</span>
                  <span>Documents</span>
                </div>
                <div className="flex-1 h-0.5 bg-slate-700" />
                <div className={`flex items-center gap-1.5 ${currentStep >= 3 ? 'text-amber-400' : 'text-slate-400'}`}>
                  <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px]">3</span>
                  <span>Payment</span>
                </div>
              </div>
            </div>

            {/* STEP 1: FORM DETAILS */}
            {currentStep === 1 && (
              <div className="p-6 md:p-8 space-y-6">
                <h3 className="font-extrabold text-base border-b border-slate-100 dark:border-slate-800 pb-2 text-slate-900 dark:text-white flex items-center gap-2">
                  <ClipboardList size={18} className="text-blue-500" />
                  <span>Applicant Personal Details (आवेदक विवरण)</span>
                </h3>

                <div className="space-y-4">
                  {/* Select Service Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Select Service * (सेवा का नाम)</label>
                    <select
                      className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-bold"
                      value={formData.serviceId}
                      onChange={handleServiceChange}
                    >
                      <option value="">-- Choose Service --</option>
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name} - ({s.price})</option>
                      ))}
                    </select>
                  </div>

                  {selectedService && (
                    <div className="bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 p-4 rounded-xl text-xs space-y-1.5">
                      <p className="font-semibold text-blue-950 dark:text-blue-300">
                        ⚡ Selected: <span className="font-black underline">{selectedService.name}</span>
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">{selectedService.desc}</p>
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        📂 Required: {selectedService.docs?.join(', ') || 'No specific docs needed'}
                      </p>
                    </div>
                  )}

                  {/* Grid Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Full Name * (पूरा नाम)</label>
                      <input
                        type="text"
                        className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                        placeholder="Name as per Aadhaar"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Father's Name (पिता का नाम)</label>
                      <input
                        type="text"
                        className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                        placeholder="Father's full name"
                        value={formData.fatherName}
                        onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Mother's Name (माता का नाम)</label>
                      <input
                        type="text"
                        className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                        placeholder="Mother's full name"
                        value={formData.motherName}
                        onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Mobile Number * (मोबाइल नंबर)</label>
                      <input
                        type="tel"
                        maxLength={10}
                        className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Email Address (ईमेल)</label>
                      <input
                        type="email"
                        className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                        placeholder="username@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Full Address * (स्थायी पता)</label>
                    <textarea
                      rows={2}
                      className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                      placeholder="Village/Town, Ward Number, Tehsil, District, PIN Code"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Aadhaar Number (Optional)</label>
                      <input
                        type="text"
                        maxLength={12}
                        className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                        placeholder="12-digit Aadhaar Card number"
                        value={formData.aadhaar}
                        onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value.replace(/[^0-9]/g, '') })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">PAN Card Number (Optional)</label>
                      <input
                        type="text"
                        maxLength={10}
                        className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 uppercase"
                        placeholder="10-digit PAN Card character code"
                        value={formData.pan}
                        onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Additional Instructions / Notes</label>
                    <textarea
                      rows={2}
                      className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                      placeholder="Add any request details or corrections you want us to do..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wide transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Upload Documents</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: DOCUMENTS UPLOADER */}
            {currentStep === 2 && (
              <div className="p-6 md:p-8 space-y-6">
                <h3 className="font-extrabold text-base border-b border-slate-100 dark:border-slate-800 pb-2 text-slate-900 dark:text-white flex items-center gap-2">
                  <Upload size={18} className="text-blue-500" />
                  <span>Upload Required Documents (दस्तावेज अपलोड करें)</span>
                </h3>

                {selectedService && (
                  <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 p-4 rounded-xl text-xs flex gap-3 text-left">
                    <Info size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-900 dark:text-amber-400">Documents needed for {selectedService.name}:</strong>
                      <ul className="list-disc pl-4 mt-1 space-y-0.5 font-semibold text-slate-600 dark:text-slate-300">
                        {selectedService.docs ? selectedService.docs.map((doc, idx) => (
                          <li key={idx}>{doc}</li>
                        )) : <li>No specific certificates required. Upload Aadhaar/Photo if needed.</li>}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Upload drag drop box */}
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-950/40 transition flex flex-col items-center">
                  <Upload size={32} className="text-slate-400 mb-3" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Select documents to upload</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-500 mb-4">Formats supported: PDF, JPG, PNG | Max size: 2MB per file</p>
                  
                  <input
                    type="file"
                    multiple
                    id="doc-file-input"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleDocUpload}
                  />
                  <label
                    htmlFor="doc-file-input"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 px-5 rounded-xl text-xs uppercase tracking-wide cursor-pointer transition shadow-sm"
                  >
                    Browse Files (फाइलें चुनें)
                  </label>
                </div>

                {/* File Uploading Progress List */}
                {Object.keys(uploadProgress).some(k => uploadProgress[k] < 100) && (
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
                    <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Uploading Progress:</h4>
                    {Object.keys(uploadProgress).map((name) => {
                      const pct = uploadProgress[name];
                      if (pct >= 100) return null;
                      return (
                        <div key={name} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl">
                          <span className="flex-1 text-[11px] font-semibold truncate text-left">{name}</span>
                          <div className="w-24 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full transition-all" style={{ width: `${pct}%` }}></div>
                          </div>
                          <span className="text-[10px] font-bold text-blue-600">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Uploaded Documents list */}
                {uploadedDocs.length > 0 && (
                  <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-left">
                    <h4 className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Uploaded Documents ({uploadedDocs.length}):</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {uploadedDocs.map((doc, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex items-center justify-between shadow-xs">
                          <div className="flex items-center gap-2 truncate">
                            <FileText size={16} className="text-blue-500 flex-shrink-0" />
                            <div className="truncate">
                              <p className="font-bold text-[11px] truncate">{doc.name}</p>
                              <span className="text-[9px] text-slate-400 font-medium">{doc.size}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteDoc(idx)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 p-1.5 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 font-bold py-2.5 px-5 rounded-xl text-xs uppercase tracking-wide transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft size={13} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wide transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT PORTAL */}
            {currentStep === 3 && (
              <div className="p-6 md:p-8 space-y-6">
                <h3 className="font-extrabold text-base border-b border-slate-100 dark:border-slate-800 pb-2 text-slate-900 dark:text-white flex items-center gap-2">
                  <QrCode size={18} className="text-blue-500" />
                  <span>Scan QR & Complete Payment (फीस भुगतान)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* UPI QR Display box */}
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col items-center shadow-xs">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm relative">
                      {/* Generates a neat mockup QR code */}
                      <div className="w-36 h-36 bg-slate-100 border border-slate-200 flex items-center justify-center relative overflow-hidden">
                        {/* Realistic Mock QR graphics using SVG */}
                        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="currentColor" className="text-slate-900">
                          {/* Corner Squares */}
                          <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="5" />
                          <rect x="10" y="10" width="15" height="15" />
                          <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="5" />
                          <rect x="75" y="10" width="15" height="15" />
                          <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="5" />
                          <rect x="10" y="75" width="15" height="15" />
                          {/* Random noise squares representing QR payload */}
                          <rect x="35" y="10" width="8" height="8" />
                          <rect x="48" y="5" width="6" height="12" />
                          <rect x="42" y="25" width="10" height="10" />
                          <rect x="60" y="32" width="14" height="6" />
                          <rect x="12" y="42" width="6" height="20" />
                          <rect x="25" y="50" width="18" height="8" />
                          <rect x="35" y="72" width="8" height="18" />
                          <rect x="55" y="78" width="12" height="12" />
                          <rect x="70" y="52" width="22" height="6" />
                          <rect x="80" y="65" width="12" height="22" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center bg-white/90 p-1 w-9 h-9 rounded-lg border border-slate-200">
                          <span className="text-[8px] font-black text-blue-900 leading-none">BHIM UPI</span>
                        </div>
                      </div>
                    </div>
                      <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/50 mt-1">
                        Amount to Pay: {selectedService ? selectedService.price : '₹100'}
                      </p>
                    </div>

                  {/* Payment Info & bank option */}
                  <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    <div className="space-y-2 bg-blue-50/70 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-200 dark:border-blue-900/40">
                      <span className="font-extrabold text-blue-900 dark:text-blue-400 flex items-center gap-1 text-[11px]">
                        <CreditCard size={13} /> Bank Details (वैकल्पिक बैंक ट्रांसफर):
                      </span>
                      <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        • Bank Name: State Bank of India (SBI) <br />
                        • Account Holder: Ashok Kumar <br />
                        • Account No: 34182947192 <br />
                        • IFSC Code: SBIN0002340
                      </p>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 p-4 rounded-xl flex gap-2.5">
                      <AlertTriangle size={20} className="text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] font-semibold text-amber-900 dark:text-amber-400 leading-normal">
                        IMPORTANT: Scan the QR code using GooglePay, PhonePe or Paytm. Scan, pay the exact amount, and take a screenshot of your payment slip.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Proof screenshot uploader */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4 text-left">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span>Upload Payment Screenshot * (पेमेंट स्क्रीनशॉट अपलोड करें)</span>
                    </label>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Applications will remain 'Pending' and documents will NOT be verified until the payment screenshot matches our bank records.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <input
                      type="file"
                      id="payment-proof-input"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePaymentProofUpload}
                    />
                    <label
                      htmlFor="payment-proof-input"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 px-5 rounded-xl text-xs uppercase tracking-wide cursor-pointer transition shadow-sm flex items-center gap-1 flex-shrink-0"
                    >
                      <Upload size={14} /> Upload Screenshot
                    </label>
                    
                    {paymentProof ? (
                      <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold truncate">
                        <CheckCircle2 size={16} />
                        <span className="truncate">{paymentProof.name}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">No screenshot uploaded yet (स्क्रीनशॉट नहीं चुना गया)</span>
                    )}
                  </div>
                </div>

                {/* Final Submit and Back Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold py-2.5 px-5 rounded-xl text-xs uppercase tracking-wide transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft size={13} />
                    <span>Back</span>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || !paymentProof}
                    onClick={handleSubmitApplication}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-8 rounded-xl text-xs uppercase tracking-wide transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
                  >
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* SUCCESS SCREEN DISPLAY */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-md text-center space-y-6 transition-colors">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 p-4 rounded-full w-fit mx-auto border border-emerald-100 dark:border-emerald-900/50">
              <CheckCircle2 size={40} className="animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-black text-slate-950 dark:text-white">Application Filed Successfully!</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                आपका आवेदन सफलतापूर्वक प्राप्त हो गया है। कृपया अपना ट्रैकिंग आईडी सुरक्षित रखें।
              </p>
            </div>

            {/* Tracking ID details box */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl max-w-sm mx-auto space-y-3.5 shadow-sm text-left">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Your Tracking ID:</span>
                <div className="text-lg font-black text-blue-900 dark:text-blue-400 select-all border-b border-dashed border-slate-200 dark:border-slate-800 pb-2">
                  {createdTrackingId}
                </div>
              </div>
              
              <div className="text-[11px] space-y-1 text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                <p>• Service: <strong className="text-slate-900 dark:text-slate-100">{selectedService?.name}</strong></p>
                <p>• Applicant: <strong className="text-slate-900 dark:text-slate-100">{formData.fullName}</strong></p>
                <p>• Phone: <strong className="text-slate-900 dark:text-slate-100">{formData.phone}</strong></p>
                <p>• Status: <span className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900/50 font-black">Submitted</span></p>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 p-4.5 rounded-2xl text-xs max-w-md mx-auto leading-relaxed text-left flex gap-2.5">
              <Info size={20} className="text-amber-600 dark:text-amber-550 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] font-semibold text-amber-900 dark:text-amber-400">
                You can check status online at any time using the Tracking ID without logging in. We will review your files, verify the bank screenshot and notify you.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                to={`/track?id=${createdTrackingId}`}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wide transition shadow-sm"
              >
                Track Status Now
              </Link>
              <Link
                to="/"
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wide transition border border-slate-200 dark:border-slate-700"
              >
                Return to Home
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
