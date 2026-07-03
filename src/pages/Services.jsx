import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Clock, FileText, ArrowRight, Tag } from 'lucide-react';
import { getServices } from '../data/db';
import { useToast } from '../context/ToastContext';

export default function Services() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');

  // Load services from IndexedDB on page mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        console.error('Error loading services:', err);
        addToast('Failed to load services database.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [addToast]);

  // Categories list
  const categories = ['All', 'Certificates', 'Registrations', 'Banking', 'Education', 'Utility', 'Cyber Cafe', 'Photography'];

  // Filter Logic
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.desc.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'All' || service.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleApplyClick = (serviceId) => {
    navigate(`/apply?service=${serviceId}`);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 min-h-screen py-10 px-4 transition-colors">
      <div className="max-w-7xl mx-auto">
        
        {/* Header section */}
        <div className="text-center space-y-4 mb-10">
          <span className="text-xs font-bold text-blue-700 dark:text-blue-450 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/50 inline-block">Services Catalog</span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Our Digital Services (हमारी ऑनलाइन सेवाएं)
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
            Choose a service to view processing details and required certificates, or apply online instantly.
          </p>
        </div>

        {/* Search & Category Filter bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4 mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search services (e.g. PAN card, Income Certificate...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-slate-250 dark:border-slate-700/60 p-2.5 pl-10 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors"
              />
            </div>
            
            {/* Category Select Mobile */}
            <div className="md:hidden">
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full border border-slate-250 dark:border-slate-700/60 p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-semibold"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop Categories List */}
          <div className="hidden md:flex flex-wrap gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-blue-650 text-white shadow-sm' 
                      : 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-650 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-500">Loading dynamic services catalog...</p>
          </div>
        ) : (
          <>
            {/* Services Grid */}
            {filteredServices.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl py-12 px-4 text-center">
                <p className="text-slate-505 dark:text-slate-400 text-xs font-bold">No services found matching your query or filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {filteredServices.map((service) => (
                  <div 
                    key={service.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850/80 rounded-2xl overflow-hidden hover:border-blue-500/30 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
                  >
                    <div className="p-5.5 space-y-4">
                      {/* Badge / Category and Name */}
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-150 dark:border-blue-900/50">
                          {service.category}
                        </span>
                        {service.price && (
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-0.5">
                            <Tag size={10} className="text-slate-400" /> Charge: {service.price}
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-base text-slate-950 dark:text-slate-50 tracking-tight leading-snug">
                        {service.name}
                      </h3>
                      
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {service.desc}
                      </p>

                      {/* Processing duration */}
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-455">
                        <Clock size={13} className="text-blue-500 dark:text-blue-400" />
                        <span>Processing Time: <strong className="text-slate-800 dark:text-slate-300">{service.processingTime || '3-5 Days'}</strong></span>
                      </div>

                      {/* Documents Box */}
                      {service.docs && service.docs.length > 0 && (
                        <div className="bg-slate-50 dark:bg-slate-850/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px]">
                          <span className="font-extrabold text-blue-900 dark:text-blue-400 flex items-center gap-1 mb-1.5">
                            <FileText size={12} /> Documents Required (आवश्यक दस्तावेज़):
                          </span>
                          <ul className="list-disc pl-4 space-y-0.5 text-slate-650 dark:text-slate-350">
                            {service.docs.map((doc, idx) => (
                              <li key={idx}>{doc}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-850/80 border-t border-slate-100 dark:border-slate-800">
                      {/* Check if service is Banking CSP - AEPS cannot be filled online (requires physical thumb impression) */}
                      {service.category === 'Banking' ? (
                        <a 
                          href={`https://wa.me/919758286172?text=Hello%20Ashok%20ji,%20I%20have%2520a%20banking%20inquiry%20regarding%2520${encodeURIComponent(service.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-extrabold py-2 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1 shadow-sm"
                        >
                          Enquire on WhatsApp
                        </a>
                      ) : (
                        <button
                          onClick={() => handleApplyClick(service.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                        >
                          <span>Apply Online (आवेदन करें)</span>
                          <ArrowRight size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {/* Support Callout */}
        <div className="mt-16 bg-blue-900 dark:bg-blue-950 text-white p-8 rounded-3xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h4 className="text-lg font-extrabold text-amber-400">Can't find the service you need?</h4>
            <p className="text-xs text-slate-300 max-w-xl">
              We update and file all types of state and national government registrations. Feel free to contact Ashok Kumar for custom queries.
            </p>
          </div>
          <div className="flex gap-3">
            <a 
              href={`tel:9758286172`}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider transition inline-block text-center"
            >
              Call Owner
            </a>
            <a 
              href={`https://wa.me/919758286172`}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider transition flex items-center gap-1.5"
            >
              <Search size={13} /> WhatsApp Ask
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
