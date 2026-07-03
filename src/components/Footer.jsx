import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageSquare, Mail, Clock, Sparkles } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-350 py-12 px-4 border-t border-slate-800 dark:border-slate-950 mt-auto transition-colors text-left">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* About column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-700 text-white p-1.5 rounded-lg">
              <Sparkles size={16} />
            </div>
            <span className="text-white font-extrabold text-base tracking-tight">{BUSINESS_INFO.name}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Serving our local community since 2000 with secure Kiosk/CSP AEPS banking, online government certificates, computer printing, and premium digital photography studio services.
          </p>
          <div className="text-xs text-slate-400 font-semibold pt-1">
            Owner: <span className="text-slate-200">{BUSINESS_INFO.owner}</span>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Quick Navigation</h4>
          <ul className="text-xs space-y-2.5 font-medium">
            <li>
              <Link to="/" className="hover:text-white transition">Home (मुख्य पृष्ठ)</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white transition">Portal Services (ऑनलाइन सेवाएं)</Link>
            </li>
            <li>
              <Link to="/apply" className="hover:text-white transition">Apply Online (ऑनलाइन आवेदन)</Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-white transition">Track Status (स्थिति जांचें)</Link>
            </li>
            <li>
              <Link to="/studio" className="hover:text-white transition">Digital Studio (कैमरा फोटो)</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="space-y-4">
          <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Contact Info</h4>
          <ul className="text-xs space-y-2.5 text-slate-400">
            <li className="flex gap-2 items-start">
              <MapPin size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
              <span className="leading-normal text-[11px]">{BUSINESS_INFO.address}</span>
            </li>
            <li className="flex gap-2 items-center">
              <Phone size={14} className="text-blue-500 flex-shrink-0" />
              <a href={`tel:${BUSINESS_INFO.phone}`} className="hover:text-white transition font-semibold">{BUSINESS_INFO.phone}</a>
            </li>
            <li className="flex gap-2 items-center">
              <MessageSquare size={14} className="text-emerald-500 flex-shrink-0" />
              <a 
                href={`https://wa.me/${BUSINESS_INFO.whatsapp.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition font-semibold"
              >
                {BUSINESS_INFO.whatsapp}
              </a>
            </li>
            <li className="flex gap-2 items-center">
              <Mail size={14} className="text-amber-500 flex-shrink-0" />
              <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-white transition font-semibold">{BUSINESS_INFO.email}</a>
            </li>
          </ul>
        </div>

        {/* Timings & Help Column */}
        <div className="space-y-4">
          <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Office Timings</h4>
          <div className="flex gap-2 items-start text-xs text-slate-400">
            <Clock size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {BUSINESS_INFO.workingHours}
            </p>
          </div>
          <div className="bg-slate-800 dark:bg-slate-950/40 p-3.5 rounded-xl border border-slate-700/60 dark:border-slate-800">
            <div className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Need Urgent Service?</div>
            <a 
              href={`tel:${BUSINESS_INFO.phone}`} 
              className="text-amber-400 hover:text-amber-300 font-extrabold text-xs block mt-1 hover:underline transition"
            >
              📞 Click to Call Us Now
            </a>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800 dark:border-slate-850 mt-10 pt-6 text-center text-xs text-slate-500 font-semibold">
        <p>© {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.</p>
        <p className="mt-1.5 text-[10px] text-slate-600">{BUSINESS_INFO.address}</p>
      </div>
    </footer>
  );
}
