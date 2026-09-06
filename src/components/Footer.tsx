import React from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Heart,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenPrescription: () => void;
  onNavigateProducts: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenPrescription,
  onNavigateProducts,
}) => {
  const { isAdmin } = useAuth();
  const { shopSettings } = useStore();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Store Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md">
                <div className="w-5 h-5 border-2 border-white rounded-sm flex items-center justify-center font-black text-xs">
                  +
                </div>
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight block">
                  Midhya Medical Store
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">
                  Bargokulpur, Kharagpur
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Your neighbourhood pharmacy providing genuine verified medicines, clinical healthcare equipment, maternal essentials, and doorstep delivery in Kharagpur.
            </p>

            <div className="flex items-center space-x-3 text-xs text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Licensed & Certified Dispensing</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#home" className="hover:text-emerald-400 transition-colors">
                  Home & Overview
                </a>
              </li>
              <li>
                <button
                  onClick={onNavigateProducts}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Medicine Catalog & OTC
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrescription}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Upload Doctor's Prescription
                </button>
              </li>
              <li>
                <a href="#about" className="hover:text-emerald-400 transition-colors">
                  About Our Pharmacy
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-emerald-400 transition-colors">
                  Store Timings & Google Map
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Operating Timings */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Opening Hours</span>
            </h4>
            
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-emerald-900/40 space-y-2 text-xs">
              <div className="text-emerald-300 font-bold">
                {shopSettings.daysOpen}
              </div>
              <div className="flex justify-between border-b border-slate-700/60 pb-1.5 text-slate-300">
                <span>Morning Shift:</span>
                <span className="font-bold text-white">{shopSettings.morningShift}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Evening Shift:</span>
                <span className="font-bold text-white">{shopSettings.eveningShift}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              For emergency medicine requirements outside store hours, please WhatsApp us.
            </p>
          </div>

          {/* Col 4: Contact & WhatsApp */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Contact Us
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-snug">
                  {shopSettings.address}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`tel:${shopSettings.phone}`}
                  className="font-bold text-white hover:text-emerald-400"
                >
                  {shopSettings.phone}
                </a>
              </div>

              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/917029350061"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-400 hover:underline"
                >
                  WhatsApp: +91 70293 50061
                </a>
              </div>
            </div>

            {isAdmin && (
              <div className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-emerald-950 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-500/30 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Legal Regulatory Compliance Disclaimer */}
        <div className="pt-8 space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <span className="font-bold text-slate-300">Regulatory & Pharmaceutical Notice: </span>
            Midhya Medical Store adheres strictly to the Drugs and Cosmetics Act, 1940 and pharmacy rules in India. Schedule H and H1 prescription drugs will only be dispensed upon verification of a valid written prescription from a registered medical practitioner. Self-medication is discouraged.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              © {new Date().getFullYear()} Midhya Medical Store. All rights reserved. Bargokulpur, Kharagpur.
            </div>
            <div className="flex items-center space-x-4">
              <span>Trusted Local Healthcare</span>
              <span>•</span>
              <button
                onClick={onOpenAdmin}
                className="text-slate-500 hover:text-slate-300 text-[11px] underline cursor-pointer"
              >
                Owner Portal
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
