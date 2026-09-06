import React from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Navigation,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  ExternalLink,
  Award,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AboutContactSection: React.FC = () => {
  const { shopSettings } = useStore();

  return (
    <section id="contact" className="py-16 bg-white border-t border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        
        {/* ABOUT SECTION */}
        <div id="about" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center space-x-2 bg-emerald-100/80 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Serving Bargokulpur & Kharagpur with Integrity</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight leading-tight">
              About Midhya Medical Store
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              Midhya Medical Store is your trusted neighbourhood healthcare partner situated at Bargokulpur, Kharagpur. We take immense pride in providing 100% authentic, batch-verified pharmaceuticals, life-saving medicines, and daily wellness essentials.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Our registered pharmacists ensure accurate dispensing, dose counsel, temperature-controlled drug storage, and rapid home delivery throughout Bargokulpur, Kharagpur town, and nearby railway & rural zones.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 space-y-1">
                <div className="text-xl font-black text-emerald-700">100%</div>
                <div className="text-xs font-bold text-slate-900">Genuine Inventory</div>
                <p className="text-[11px] text-slate-500">Sourced directly from certified pharmaceutical distributors.</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 space-y-1">
                <div className="text-xl font-black text-emerald-700">7 Days</div>
                <div className="text-xs font-bold text-slate-900">Operational Shifts</div>
                <p className="text-[11px] text-slate-500">Morning 7 AM–12 PM & Evening 4 PM–8 PM daily.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-emerald-100 aspect-4/3 bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1576602976047-174e57a47881?w=900&auto=format&fit=crop&q=80"
                alt="Midhya Medical Store Pharmacy Shelf"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Licensed Pharmacy</span>
                  <div className="text-lg font-bold">Midhya Medical Store, Bargokulpur</div>
                  <div className="text-xs text-emerald-100">Registered Pharmacist on Duty Every Day</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT, TIMINGS & GOOGLE MAP */}
        <div className="bg-emerald-50/60 rounded-3xl p-6 sm:p-10 border border-emerald-100 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
              Visit or Contact Us
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Located conveniently in Bargokulpur, Kharagpur. Walk in, call for fast prescription preparation, or request doorstep delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Contact & Hours Info Column */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Timing Card matching Vibrant Palette */}
              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-2xs space-y-3">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Store Hours</span>
                </div>

                <div className="text-sm font-extrabold text-slate-900">
                  {shopSettings.daysOpen}
                </div>

                <div className="space-y-2 text-xs pt-1 border-t border-emerald-50">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-700">Morning Shift:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {shopSettings.morningShift}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-700">Evening Shift:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {shopSettings.eveningShift}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-2xs space-y-3">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Physical Address</span>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {shopSettings.address}
                </p>

                <div className="pt-2 flex flex-wrap gap-2">
                  <a
                    href="https://maps.app.goo.gl/2zpiacVGHoHNeC6P9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-2xs"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                    <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                  </a>
                </div>
              </div>

              {/* Call & WhatsApp buttons matching Vibrant Palette */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${shopSettings.phone}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-3.5 rounded-2xl flex items-center justify-center space-x-2 text-xs transition-colors shadow-2xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Store</span>
                </a>

                <a
                  href={`https://wa.me/917029350061?text=${encodeURIComponent('Hello Midhya Medical Store, I need medicines.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-3.5 rounded-2xl flex items-center justify-center space-x-2 text-xs transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>

            </div>

            {/* Interactive Map Embed Column */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-xs flex flex-col justify-between">
              <div className="p-3.5 border-b border-emerald-50 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 font-bold text-slate-800">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Midhya Medical Store on Google Maps</span>
                </div>
                <a
                  href="https://maps.app.goo.gl/2zpiacVGHoHNeC6P9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:underline font-bold flex items-center"
                >
                  <span>Open Full Map</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>

              {/* Google Map iframe centered around Bargokulpur, Kharagpur */}
              <div className="w-full h-80 sm:h-96 relative bg-slate-100">
                <iframe
                  title="Midhya Medical Store Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14749.12345678!2d87.31!3d22.34!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDIwJzI0LjAiTiA4N8KwMTgnMzYuMCJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              <div className="p-3 bg-emerald-50/50 border-t border-emerald-100 text-[11px] text-slate-600 text-center font-medium">
                📍 Bargokulpur, Kharagpur, Paschim Medinipur, West Bengal 721301 • Phone: +91 70293 50061
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
