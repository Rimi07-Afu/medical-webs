import React from 'react';
import {
  ShieldCheck,
  PhoneCall,
  Clock,
  Sparkles,
  ShoppingBag,
  FileUp,
  MessageCircle,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeroProps {
  onOrderClick: () => void;
  onUploadRxClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderClick, onUploadRxClick }) => {
  const { shopSettings } = useStore();

  return (
    <section id="home" className="relative bg-emerald-50/60 pt-6 pb-12 lg:pt-8 lg:pb-16 overflow-hidden">
      {/* Background soft geometric glows */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-300/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Main Hero Card matching Vibrant Palette */}
        <div className="bg-emerald-600 rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Subtle background decorative circle */}
          <div className="absolute -right-10 bottom-0 opacity-15 pointer-events-none">
            <ShieldCheck className="w-80 h-80 text-white" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Pill Badge */}
              <div className="inline-flex items-center space-x-2 bg-emerald-700/70 text-emerald-100 text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-400/40 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Trusted Local Pharmacy in Bargokulpur, Kharagpur</span>
              </div>

              {/* Display Headline */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                  Your Health, <br />
                  <span className="text-emerald-200">Our Priority.</span>
                </h1>
              </div>

              {/* Subtext */}
              <p className="text-emerald-50 text-base sm:text-lg max-w-xl leading-relaxed">
                Order genuine medicines and health products with fast local home delivery or quick counter pickup in Bargokulpur & Kharagpur.
              </p>

              {/* Dual CTAs & WhatsApp button matching Vibrant Palette */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={onOrderClick}
                  className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 text-sm cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-700" />
                  <span>Order Now</span>
                </button>

                <button
                  onClick={onUploadRxClick}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white border-2 border-emerald-400 font-bold px-5 py-3.5 rounded-xl transition-all flex items-center space-x-2 text-sm shadow-sm cursor-pointer"
                >
                  <FileUp className="w-4 h-4 text-white" />
                  <span>Upload Prescription</span>
                </button>

                <a
                  href={`https://wa.me/917029350061?text=${encodeURIComponent('Hello Midhya Medical Store, I want to order medicines.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-700/80 hover:bg-emerald-700 text-white border border-emerald-400/40 font-bold px-4 py-3.5 rounded-xl transition-all flex items-center space-x-2 text-sm shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Three key trust pillars */}
              <div className="pt-6 grid grid-cols-3 gap-3 border-t border-emerald-500/60 max-w-lg">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-700/80 text-emerald-200 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-white">100%</div>
                    <div className="text-[11px] font-medium text-emerald-100 leading-tight">Genuine Meds</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-700/80 text-emerald-200 flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-white">5.0 ★</div>
                    <div className="text-[11px] font-medium text-emerald-100 leading-tight">Google Rating</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-700/80 text-emerald-200 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-white">7 Days</div>
                    <div className="text-[11px] font-medium text-emerald-100 leading-tight">Dual Shift Open</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Hero Column: Framed visual with floating emergency card */}
            <div className="lg:col-span-5 relative flex justify-center">
              
              {/* The circular / arch graphic backdrop */}
              <div className="relative w-full max-w-md">
                <div className="w-full aspect-4/5 rounded-3xl bg-gradient-to-tr from-emerald-800 via-emerald-600 to-emerald-400 p-1.5 shadow-2xl relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80"
                    alt="Certified Pharmacist Midhya Medical Store"
                    className="w-full h-full object-cover object-top rounded-[22px]"
                  />

                  {/* Dark gradient overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent pointer-events-none" />

                  {/* Store banner at bottom */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
                      Bargokulpur, Kharagpur
                    </div>
                    <div className="font-bold text-sm">
                      Midhya Medical Store & Healthcare
                    </div>
                  </div>
                </div>

                {/* Floating Emergency & WhatsApp Badge */}
                <div className="absolute -bottom-5 -left-3 sm:-left-6 bg-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-emerald-100 flex items-center space-x-3.5 max-w-xs text-slate-900">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                      Quick Phone & WhatsApp
                    </div>
                    <a
                      href={`tel:${shopSettings.phone}`}
                      className="text-sm font-black text-slate-900 hover:text-emerald-600 transition-colors block"
                    >
                      +91 70293 50061
                    </a>
                  </div>
                </div>

                {/* Floating Hours Badge */}
                <div className="absolute -top-3 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-lg border border-emerald-100 text-slate-800 text-xs space-y-0.5">
                  <div className="flex items-center text-emerald-700 font-bold text-[11px]">
                    <Clock className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Store Timings
                  </div>
                  <div className="font-semibold text-slate-700">7:00 AM – 12:00 PM</div>
                  <div className="font-semibold text-slate-700">4:00 PM – 8:00 PM</div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
