import React, { useState } from 'react';
import { Camera, Calendar, Phone, MapPin, Send, Sparkles, MessageSquare, Clock } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';
import { useToast } from '../context/ToastContext';
import { addStudioBooking } from '../data/db';

export default function DigitalStudio() {
  const { addToast } = useToast();
  
  // Gallery Categorization
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Booking Inquiry form state
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    shootType: 'Passport Size Photo',
    eventDate: '',
    location: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Curated Unsplash images for the studio gallery
  const galleryItems = [
    { id: 1, title: 'Classic Studio Portrait', category: 'Portraits', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600', desc: 'Matrimonial & professional bio portraits.' },
    { id: 2, title: 'Traditional Wedding Couple', category: 'Weddings', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600', desc: 'Candid wedding moments.' },
    { id: 3, title: 'Outdoor Pre-Wedding Shoot', category: 'Weddings', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600', desc: 'Vibrant natural portraits.' },
    { id: 4, title: 'First Birthday Celebration', category: 'Events', url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=600', desc: 'Fun baby birthday shoots.' },
    { id: 5, title: 'Restoration & Frame Mockup', category: 'Restorations', url: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&q=80&w=600', desc: 'Restoring memories & framing prints.' },
    { id: 6, title: 'High-Gloss Passport Sheets', category: 'Portraits', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600', desc: 'Instant 5-minute passport prints.' },
    { id: 7, title: 'Night Event Festivity', category: 'Events', url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=600', desc: 'Family gathering & local function shoots.' },
    { id: 8, title: 'Vintage Photo Revamp', category: 'Restorations', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600', desc: 'Historical black & white colorization.' }
  ];

  // Services list
  const services = [
    { title: 'Passport Size Photography', desc: 'Instant biometric standard photos printed in 5 minutes with neat background edits.' },
    { title: 'Studio Portrait Photography', desc: 'Professional profiles, matrimonial bios, and family portrait sessions.' },
    { title: 'Wedding & Pre-Wedding Shoots', desc: 'High-end DSLR photography, videography, cinematic couple shoots, and drones.' },
    { title: 'Birthday & Event Coverage', desc: 'Documenting baby birthdays, corporate launches, anniversaries, and local community meets.' },
    { title: 'Old Photo Restoration', desc: 'Colorizing, repairing, and editing torn, faded, or black & white historical pictures.' },
    { title: 'Frame & Canvas Printing', desc: 'Large size custom printing, digital laminations, and premium glass frame borders.' },
    { title: 'ID Card PVC Printing', desc: 'Bulk and individual prints for corporate ID cards, Aadhaar, PAN, and Voter PVCs.' },
    { title: 'Background Removal', desc: 'Quick digital backdrop corrections and professional studio touch-ups.' }
  ];

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.name.trim() || !bookingForm.phone.trim() || !bookingForm.eventDate.trim()) {
      addToast('Please fill in Name, Phone, and Event Date.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      // Save record in database
      await addStudioBooking({
        type: 'booking',
        name: bookingForm.name,
        phone: bookingForm.phone,
        shootType: bookingForm.shootType,
        eventDate: bookingForm.eventDate,
        location: bookingForm.location,
        notes: bookingForm.notes,
        status: 'Pending'
      });

      addToast('Booking inquiry submitted successfully! Ashok Kumar will contact you shortly.', 'success');
      setBookingForm({
        name: '',
        phone: '',
        shootType: 'Passport Size Photo',
        eventDate: '',
        location: '',
        notes: ''
      });
    } catch (err) {
      console.error(err);
      addToast('Failed to log booking inquiry. Try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredGallery = galleryItems.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 min-h-screen py-12 px-4 transition-colors">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Hero Section */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-1 bg-pink-50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-400 text-xs font-black uppercase py-1.5 px-4.5 rounded-full border border-pink-200 dark:border-pink-900/50 tracking-wider">
            <Sparkles size={12} /> Deep Digital Studio (Chhutmalpur)
          </span>
          <h2 className="text-3xl md:text-4.5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Capturing Your Precious Moments
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            Professional wedding photography, baby portraiture, event shoots, frames laminations, and 5-minute passport photos — managed by Ashok Kumar since 2000.
          </p>
        </div>

        {/* Dynamic Studio Services Grid */}
        <div className="space-y-8">
          <h3 className="text-xl md:text-2xl font-black text-slate-950 dark:text-slate-50 text-left border-l-4 border-pink-650 pl-3">
            Our Photography Services (स्टूडियो सेवाएं)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {services.map((serv, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl shadow-xs hover:shadow-md hover:border-pink-500/20 transition duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-400 p-2.5 rounded-xl w-fit">
                    <Camera size={18} />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">{serv.title}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{serv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery Section */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-4 border-pink-650 pl-3">
            <h3 className="text-xl md:text-2xl font-black text-slate-955 dark:text-slate-50 text-left">
              Sample Photo Gallery (गैलरी सैंपल)
            </h3>
            
            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Portraits', 'Weddings', 'Events', 'Restorations'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeCategory === cat 
                      ? 'bg-pink-600 text-white shadow-xs' 
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-605 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGallery.map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition group text-left"
              >
                {/* Photo container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-350"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-pink-600/90 text-white font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-lg border border-pink-500/20">
                    {item.category}
                  </div>
                </div>
                
                {/* Descriptions */}
                <div className="p-4 space-y-1">
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking & Inquiry Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-stretch">
          
          {/* Details visual left card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-pink-50 via-slate-100 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-850 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[9px] font-black tracking-widest uppercase text-pink-700 bg-pink-100 dark:bg-pink-950/40 px-2.5 py-0.5 rounded border border-pink-200 dark:border-pink-900/50">Reservations</span>
                <h4 className="font-black text-xl text-slate-950 dark:text-white leading-tight">Book Photography Sessions</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Fill in the booking form to schedule home visits or outdoor candid sessions for weddings, pre-weddings, birthdays, or events.
                </p>
              </div>

              <div className="space-y-3.5 text-xs text-slate-650 dark:text-slate-350">
                <div className="flex gap-2">
                  <MapPin size={16} className="text-red-500 flex-shrink-0" />
                  <span>Serving Chhutmalpur, Saharanpur, Dehradun, and nearby areas.</span>
                </div>
                <div className="flex gap-2">
                  <Phone size={16} className="text-blue-500 flex-shrink-0" />
                  <span>Direct Booking: <strong className="text-slate-800 dark:text-white font-extrabold">{BUSINESS_INFO.phone}</strong></span>
                </div>
                <div className="flex gap-2">
                  <Clock size={16} className="text-amber-500 flex-shrink-0" />
                  <span>Shoot slots available on all Sundays and weekdays.</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/80 mt-6 text-center">
              <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Need Instant Passport Prints?</span>
              <p className="text-[11px] font-semibold text-pink-700 dark:text-pink-400 mt-0.5">⚡ No booking required! Just walk into our shop.</p>
            </div>
          </div>

          {/* Form right card */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-905 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="font-extrabold text-base text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                Studio Shoot Booking Form (बुकिंग फॉर्म)
              </h4>

              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Your Name * (आपका नाम)</label>
                    <input 
                      type="text"
                      className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl text-xs focus:outline-none focus:border-pink-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors"
                      placeholder="Enter full name"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Mobile Number * (मोबाइल नंबर)</label>
                    <input 
                      type="tel"
                      maxLength={10}
                      className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl text-xs focus:outline-none focus:border-pink-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors"
                      placeholder="10-digit phone number"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value.replace(/[^0-9]/g, '') })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Shoot Category (शूट प्रकार)</label>
                    <select
                      className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl text-xs focus:outline-none focus:border-pink-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors font-semibold"
                      value={bookingForm.shootType}
                      onChange={(e) => setBookingForm({ ...bookingForm, shootType: e.target.value })}
                    >
                      <option value="Passport Size Photo">Passport Size Photo (पासपोर्ट फ़ोटो)</option>
                      <option value="matrimonial Portrait"> Matrimonial Studio Portrait (स्टूडियो बायो फ़ोटो)</option>
                      <option value="Wedding Shoots">Wedding Photography (शादी फोटोग्राफी)</option>
                      <option value="Pre Wedding Shoots">Pre-Wedding Shoots (प्री-वेडिंग)</option>
                      <option value="Birthday Event">Birthday Party Shoot (जन्मदिन शूट)</option>
                      <option value="Photo Restoration">Photo Restoration (पुरानी फ़ोटो रिपेयर)</option>
                      <option value="Frame Printing">Frame Canvas Printing (फ्रेम प्रिंटिंग)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Event Date * (कार्यक्रम तिथि)</label>
                    <input 
                      type="date"
                      className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl text-xs focus:outline-none focus:border-pink-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors font-semibold"
                      value={bookingForm.eventDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, eventDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Shoot Location Address (शूट का स्थान)</label>
                  <input 
                    type="text"
                    className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl text-xs focus:outline-none focus:border-pink-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors"
                    placeholder="e.g. Community Hall name or Village/Town name"
                    value={bookingForm.location}
                    onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Special Requests / Requirements</label>
                  <textarea 
                    rows={3}
                    className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl text-xs focus:outline-none focus:border-pink-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors"
                    placeholder="e.g. Need frames printing, or custom design details..."
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wide transition shadow-sm flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Send size={12} />
                    <span>{isSubmitting ? 'Sending...' : 'Send Inquiry'}</span>
                  </button>
                  
                  <a
                    href={`https://wa.me/919758286172?text=Hello%20Ashok%20ji,%20I%20want%20to%20book%20a%20studio%20session%20for%2520${encodeURIComponent(bookingForm.shootType)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wide transition shadow-sm flex items-center gap-1.5"
                  >
                    <MessageSquare size={13} />
                    <span>WhatsApp Chat</span>
                  </a>
                </div>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
