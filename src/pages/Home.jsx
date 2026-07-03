import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Phone, MessageSquare, Landmark, FileText, Printer, Camera, 
  ChevronDown, ChevronUp, CheckCircle, ShieldCheck, 
  MapPin, Clock, Mail, Send, Award, Users
} from 'lucide-react';
import { 
  BUSINESS_INFO, TRUST_BADGES, HOW_IT_WORKS_STEPS, TESTIMONIALS, FAQS 
} from '../data/businessData';
import { useToast } from '../context/ToastContext';
import { addStudioBooking } from '../data/db';

export default function Home() {
  const { addToast } = useToast();
  const [activeFaq, setActiveFaq] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/about') {
      const el = document.getElementById('about-us');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (location.pathname === '/contact') {
      const el = document.getElementById('contact-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    service: 'General Enquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.phone.trim() || !contactForm.message.trim()) {
      addToast('Please fill in all fields (कृपया सभी फ़ील्ड भरें)', 'warning');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Save enquiry to database under studio_bookings store (general inquiries)
      await addStudioBooking({
        type: 'inquiry',
        name: contactForm.name,
        phone: contactForm.phone,
        service: contactForm.service,
        notes: contactForm.message,
        status: 'Pending'
      });
      
      addToast('Enquiry submitted successfully! We will contact you soon. (पूछताछ दर्ज कर ली गई है!)', 'success');
      setContactForm({
        name: '',
        phone: '',
        service: 'General Enquiry',
        message: ''
      });
    } catch (err) {
      console.error(err);
      addToast('Failed to submit enquiry. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden py-16 md:py-24 px-4">
        {/* Glowing visual enhancements */}
        <div className="absolute inset-0 bg-radial-gradient from-blue-700/20 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10 text-left">
          {/* Left Text Detail */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 bg-blue-900/60 dark:bg-blue-950/80 border border-blue-700 text-blue-300 text-xs font-black uppercase py-1 px-3 rounded-full tracking-wider">
              <Award size={12} className="text-amber-400" /> Government CSC & CSP Banking Center
            </span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5.5xl font-black tracking-tight leading-tight">
              One-Stop Portal for <span className="text-amber-400 block sm:inline">Online Services, Banking & Studio</span>
            </h2>
            
            <p className="text-slate-350 text-sm md:text-base max-w-xl leading-relaxed">
              Apply for government certificates, file scholarship applications, withdraw banking cash, format & print documents, and book photography sessions — directly online or at our physical center in Chhutmalpur.
            </p>
            
            <p className="text-amber-300 dark:text-amber-400 text-xs md:text-sm italic font-semibold">
              "बैंकिंग लेनदेन, सरकारी प्रमाण पत्र, फोटोकॉपी, फॉर्म भरने और फ़ोटो स्टूडियो की सभी सुविधाएं ऑनलाइन उपलब्ध हैं।"
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link 
                to="/services" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-6 rounded-xl shadow-lg hover:shadow-blue-900/30 transition text-xs uppercase tracking-wider cursor-pointer"
              >
                View Services (सेवाएं देखें)
              </Link>
              <Link 
                to="/apply" 
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 px-6 rounded-xl shadow-lg hover:shadow-amber-500/20 transition text-xs uppercase tracking-wider cursor-pointer"
              >
                Apply Online (ऑनलाइन भरें)
              </Link>
              <a 
                href={`https://wa.me/${BUSINESS_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Ashok%20ji,%20I%20need%20help%20with%20online%20services.`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-6 rounded-xl shadow-lg hover:shadow-emerald-900/20 transition flex items-center gap-2 text-xs uppercase tracking-wider"
              >
                <MessageSquare size={15} /> WhatsApp Now
              </a>
            </div>

            {/* Bullet list highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-6 border-t border-slate-800 text-[11px] text-slate-400 font-bold uppercase">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-blue-500" />
                <span>Authorized CSC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-blue-500" />
                <span>Kiosk Banking (CSP)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-blue-500" />
                <span>Digital Photo Studio</span>
              </div>
            </div>
          </div>

          {/* Right Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <Link 
              to="/services"
              className="bg-slate-850/80 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-700/50 hover:border-blue-550 dark:hover:border-blue-500/50 hover:scale-[1.03] transition duration-300 shadow-md flex flex-col justify-between h-40"
            >
              <Landmark className="text-blue-400" size={32} />
              <div>
                <h3 className="font-extrabold text-sm text-slate-100">CSP Banking</h3>
                <p className="text-[11px] text-slate-400 mt-1">Cash withdrawals (AEPS), mini statements, instant deposits.</p>
              </div>
            </Link>

            <Link 
              to="/services"
              className="bg-slate-850/80 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-700/50 hover:border-amber-500/50 hover:scale-[1.03] transition duration-300 shadow-md flex flex-col justify-between h-40"
            >
              <FileText className="text-amber-400" size={32} />
              <div>
                <h3 className="font-extrabold text-sm text-slate-100">CSC Services</h3>
                <p className="text-[11px] text-slate-400 mt-1">Income, Caste certificates, Voter, and PAN filings.</p>
              </div>
            </Link>

            <Link 
              to="/services"
              className="bg-slate-850/80 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-700/50 hover:border-teal-500/50 hover:scale-[1.03] transition duration-300 shadow-md flex flex-col justify-between h-40"
            >
              <Printer className="text-teal-400" size={32} />
              <div>
                <h3 className="font-extrabold text-sm text-slate-100">Cyber Cafe</h3>
                <p className="text-[11px] text-slate-400 mt-1">High-speed print, copies, binding, lamination, and typing.</p>
              </div>
            </Link>

            <Link 
              to="/studio"
              className="bg-slate-850/80 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-700/50 hover:border-pink-500/50 hover:scale-[1.03] transition duration-300 shadow-md flex flex-col justify-between h-40"
            >
              <Camera className="text-pink-400" size={32} />
              <div>
                <h3 className="font-extrabold text-sm text-slate-100">Photo Studio</h3>
                <p className="text-[11px] text-slate-400 mt-1">Instant passport size prints, restoration, album designing.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC STATS SECTION */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-8 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-around items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 p-3 rounded-2xl">
              <Users size={24} />
            </div>
            <div className="text-left">
              <h4 className="text-2xl font-black text-slate-900 dark:text-slate-100">{BUSINESS_INFO.stats.customersServed}</h4>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Satisfied Customers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 p-3 rounded-2xl">
              <Clock size={24} />
            </div>
            <div className="text-left">
              <h4 className="text-2xl font-black text-slate-900 dark:text-slate-100">{BUSINESS_INFO.stats.yearsOfService}</h4>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Years of Service</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 p-3 rounded-2xl">
              <CheckCircle size={24} />
            </div>
            <div className="text-left">
              <h4 className="text-2xl font-black text-slate-900 dark:text-slate-100">{BUSINESS_INFO.stats.successRate}</h4>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Application Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BUSINESS INTRODUCTION */}
      <section id="about-us" className="py-16 px-4 max-w-7xl mx-auto text-left transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-450 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/50 inline-block">Introduction (परिचय)</span>
            <h3 className="text-2xl md:text-3.5xl font-black text-slate-950 dark:text-slate-50 leading-tight">
              Proudly Serving Chhutmalpur and Surrounding Regions Since 2000
            </h3>
            <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed">
              {BUSINESS_INFO.aboutText}
            </p>
            
            <div className="bg-blue-50 dark:bg-slate-900/50 p-4.5 rounded-xl border border-blue-100 dark:border-slate-800 text-xs">
              <h4 className="font-bold text-blue-900 dark:text-blue-400 mb-1">Key Offerings:</h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-350 font-medium">
                <li>Instant UPI-payment receipt validation & processing</li>
                <li>Digital portal document uploads & application tracking system</li>
                <li>Instant passport size photo prints & old photograph restorations</li>
                <li>Biometric cash withdrawal (AEPS) and secure domestic transfers</li>
              </ul>
            </div>

            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">
              Registered Owner: <strong className="text-slate-900 dark:text-white font-extrabold">{BUSINESS_INFO.owner}</strong>
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-850 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden flex flex-col justify-center min-h-[340px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl" />
            
            <div className="space-y-4 z-10 relative">
              <div className="bg-blue-600 text-white p-4.5 rounded-full w-fit mx-auto shadow-md">
                <Users size={32} />
              </div>
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Trusted Community Kiosk</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                हमारा केंद्र सभी सरकारी योजनाओं, प्रमाण पत्रों, छात्रवृत्ति एवं बैंकिंग कार्यों को बिना गलती के और बहुत कम शुल्क में ऑनलाइन पूरा करता है।
              </p>
              <div className="pt-2">
                <Link 
                  to="/apply" 
                  className="bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-900 dark:hover:bg-slate-600 font-extrabold text-xs py-2.5 px-6 rounded-lg tracking-wide uppercase transition inline-block shadow-sm"
                >
                  Apply Online Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="bg-slate-100 dark:bg-slate-900/50 py-16 px-4 border-y border-slate-250 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-450 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/50 inline-block">Core Values</span>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              Why Local Residents Trust Our Kiosk
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
              We ensure 100% transparency, zero errors, and rapid updates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {TRUST_BADGES.map((badge, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 hover:border-blue-500/30 hover:shadow-md transition duration-200 flex gap-4"
              >
                <div className="bg-blue-50 dark:bg-blue-950 text-blue-755 dark:text-blue-400 p-2.5 rounded-xl h-fit">
                  <ShieldCheck size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">{badge.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-widest bg-blue-950 px-3 py-1 rounded-full border border-blue-800 inline-block">Step-By-Step Portal</span>
            <h3 className="text-2xl md:text-3xl font-black text-white">
              How the Digital Portal Works (कार्य प्रणाली)
            </h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Follow 4 easy steps to submit documents, pay, and track your slips.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <div key={idx} className="relative z-10 text-center space-y-3 flex flex-col items-center">
                <div className="bg-amber-400 text-slate-950 w-12 h-12 rounded-full font-black text-lg flex items-center justify-center shadow-lg border-4 border-slate-900">
                  {step.step}
                </div>
                <h4 className="font-bold text-sm text-slate-100">{step.title}</h4>
                <p className="text-xs text-slate-350 max-w-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. OUR SERVICES PREVIEW */}
      <section id="services-overview" className="py-16 px-4 max-w-7xl mx-auto transition-colors">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-blue-700 dark:text-blue-450 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/50 inline-block">Service Highlights</span>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            Available Service Categories
          </h3>
          <p className="text-slate-605 dark:text-slate-400 text-sm max-w-md mx-auto">
            Explore certificates, registrations, and studio booking systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {/* Category Cards */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="p-6 space-y-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 p-3 rounded-xl w-fit">
                <Landmark size={24} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">CSP & Banking</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Aadhaar Enabled Payment (AEPS) biometric withdrawals, money transfers, mini statements, and subsidy checks.
              </p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800">
              <Link to="/services?category=Banking" className="w-full bg-blue-650 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs transition inline-block text-center cursor-pointer">
                View Banking List
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="p-6 space-y-4">
              <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-705 dark:text-amber-400 p-3 rounded-xl w-fit">
                <FileText size={24} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">CSC / Online Forms</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Income certificates, domicile, caste certificates, voter registration, Ayushman cards, and PAN card filing.
              </p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800">
              <Link to="/services?category=Certificates" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition inline-block text-center cursor-pointer font-extrabold">
                View Govt Services
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="p-6 space-y-4">
              <div className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 p-3 rounded-xl w-fit">
                <Printer size={24} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Cyber Cafe Work</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Premium high-speed photocopy, double-sided color printing, documents scanning, custom laminations, and bindings.
              </p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800">
              <Link to="/services?category=Cyber%20Cafe" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-lg text-xs transition inline-block text-center cursor-pointer">
                View Cyber Services
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="p-6 space-y-4">
              <div className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 p-3 rounded-xl w-fit">
                <Camera size={24} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Digital Studio</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Instant passport photo print, professional family portraits, birthday photography, and old photo color restoration.
              </p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800">
              <Link to="/studio" className="w-full bg-pink-650 hover:bg-pink-700 text-white font-bold py-2.5 rounded-lg text-xs transition inline-block text-center cursor-pointer">
                Open Studio Section
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="bg-slate-100 dark:bg-slate-900/50 py-16 px-4 border-y border-slate-250 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-450 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/50 inline-block">Reviews (फीडबैक)</span>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              What Our Customers Say (ग्राहकों की राय)
            </h3>
            <p className="text-slate-600 dark:text-slate-405 text-sm max-w-md mx-auto">
              Real testimonials from local farmers, students, and merchants in Chhutmalpur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {TESTIMONIALS.map((test, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between shadow-xs"
              >
                <p className="text-xs text-slate-650 dark:text-slate-300 italic leading-relaxed">
                  "{test.quote}"
                </p>
                <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <h4 className="font-extrabold text-xs text-slate-950 dark:text-white">{test.author}</h4>
                  <div className="flex justify-between items-center text-[9px] text-slate-500 dark:text-slate-450 font-bold mt-1 uppercase tracking-wider">
                    <span>{test.role}</span>
                    <span className="text-blue-600 dark:text-blue-400">📍 {test.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section id="faq-section" className="py-16 px-4 max-w-4xl mx-auto transition-colors">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold text-blue-700 dark:text-blue-450 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/50 inline-block">Help Desk</span>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
            Click on any question to view answers.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs text-left"
              >
                <button
                  className="w-full py-4 px-5 text-left font-bold text-slate-950 dark:text-slate-50 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850 transition"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                >
                  <span className="text-sm md:text-base">{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} className="text-blue-600 dark:text-blue-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="p-5 bg-slate-50 dark:bg-slate-850/50 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-650 dark:text-slate-350 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. CONTACT SECTION & MAPS */}
      <section id="contact-section" className="bg-slate-100 dark:bg-slate-900/40 py-16 px-4 border-t border-slate-250 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-450 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/50 inline-block">Contact Center (संपर्क सूत्र)</span>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              Visit Us or Submit Online Inquiry
            </h3>
            <p className="text-slate-650 dark:text-slate-400 text-sm max-w-lg mx-auto">
              Need assistance? Drop us a query or call Ashok Kumar directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
            {/* Business Contact Cards & Maps */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-850 shadow-sm space-y-5">
                <h4 className="font-extrabold text-base text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Business Address</h4>
                
                <div className="flex gap-3 text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
                  <MapPin size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Deep Jan Sewa Kendra:</strong> <br />
                    {BUSINESS_INFO.address}
                  </div>
                </div>

                <div className="flex gap-3 text-xs text-slate-650 dark:text-slate-350">
                  <Phone size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Call Owner (अशोक कुमार):</strong> <br />
                    <a href={`tel:${BUSINESS_INFO.phone}`} className="hover:text-blue-700 dark:hover:text-blue-400 font-extrabold block mt-0.5">{BUSINESS_INFO.phone}</a>
                  </div>
                </div>

                <div className="flex gap-3 text-xs text-slate-650 dark:text-slate-350 font-medium">
                  <MessageSquare size={18} className="text-emerald-500 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">WhatsApp Support:</strong> <br />
                    <a 
                      href={`https://wa.me/${BUSINESS_INFO.whatsapp.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-emerald-600 dark:hover:text-emerald-400 font-extrabold block mt-0.5"
                    >
                      {BUSINESS_INFO.whatsapp}
                    </a>
                  </div>
                </div>

                <div className="flex gap-3 text-xs text-slate-650 dark:text-slate-350">
                  <Mail size={18} className="text-amber-500 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Email Address:</strong> <br />
                    <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-blue-700 dark:hover:text-blue-400 font-extrabold block mt-0.5">{BUSINESS_INFO.email}</a>
                  </div>
                </div>

                <div className="flex gap-3 text-xs text-slate-650 dark:text-slate-350">
                  <Clock size={18} className="text-blue-500 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Working Hours:</strong> <br />
                    <span className="block mt-0.5 font-medium">{BUSINESS_INFO.workingHours}</span>
                  </div>
                </div>
              </div>

              {/* Maps widget */}
              <div className="bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl h-48 overflow-hidden relative shadow-sm">
                <iframe 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(BUSINESS_INFO.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Location"
                ></iframe>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="font-extrabold text-base text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
                Send Query / Book Service (सम्पर्क फॉर्म)
              </h4>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Your Name (आपका नाम)</label>
                    <input
                      type="text"
                      className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors"
                      placeholder="e.g. Ashok Kumar"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Mobile Number (मोबाइल नंबर)</label>
                    <input
                      type="tel"
                      className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors"
                      placeholder="e.g. 9876543210"
                      maxLength={10}
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value.replace(/[^0-9]/g, '') })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Service Type (आवश्यक सेवा)</label>
                  <select
                    className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors font-semibold"
                    value={contactForm.service}
                    onChange={(e) => setContactForm({ ...contactForm, service: e.target.value })}
                  >
                    <option value="General Enquiry">General Enquiry (सामान्य पूछताछ)</option>
                    <option value="CSC Online Form">CSC / Certificate Form (सरकारी प्रमाण पत्र)</option>
                    <option value="Kiosk Banking">Kiosk AEPS Banking (बैंकिंग सेवा)</option>
                    <option value="Passport Size Photo">Passport Size Photos (पासपोर्ट फ़ोटो)</option>
                    <option value="Wedding Shoots">Wedding / Party Photography (शादी फोटोग्राफी)</option>
                    <option value="Photo Restoration">Photo Restoration (पुरानी फ़ोटो रिस्टोर)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Message details (अपना संदेश लिखें)</label>
                  <textarea
                    rows={4}
                    className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors"
                    placeholder="Describe your requirement in detail..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 px-6 rounded-xl text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send size={13} />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Inquiry'}</span>
                  </button>
                  <a 
                    href={`https://wa.me/${BUSINESS_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Ashok%20ji,%20I%20have%20an%20enquiry%20regarding%2520${encodeURIComponent(contactForm.service)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 px-6 rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
                  >
                    <MessageSquare size={13} />
                    <span>WhatsApp Chat</span>
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
