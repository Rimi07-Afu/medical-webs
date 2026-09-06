import React from 'react';
import {
  HeartPulse,
  Stethoscope,
  Activity,
  Baby,
  ArrowRight,
  CheckCircle2,
  Truck,
  PhoneCall,
  Clock,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface ServicesSectionProps {
  onCategorySelect: (category: string) => void;
  onUploadRxClick: () => void;
  onOrderClick: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onCategorySelect,
  onUploadRxClick,
  onOrderClick,
}) => {
  const { shopSettings } = useStore();

  const services = [
    {
      id: 'chronic',
      title: 'Cardiology & BP Care',
      category: 'Cardiac & Blood Pressure',
      description: 'Prescription refills for hypertension, cholesterol, and heart wellness from top brands like Glenmark & Cipla.',
      icon: HeartPulse,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'general',
      title: 'General Prescription Care',
      category: 'Fever & Pain Relief',
      description: 'Comprehensive medicines for fever, acute pain, seasonal allergies, bacterial infections, and first-aid.',
      icon: Stethoscope,
      color: 'text-teal-700 bg-teal-50 border-teal-200',
    },
    {
      id: 'diabetes',
      title: 'Diabetes & Diagnostics',
      category: 'Diabetes Care',
      description: 'Metformin, Glimepiride, insulin cartridges, glucometer strips, and daily sugar management products.',
      icon: Activity,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'baby',
      title: 'Mother & Child Care',
      category: 'Baby & Mother Care',
      description: 'Tear-free shampoos, rash creams, infant formula, baby diapers, and maternal nutritional supplements.',
      icon: Baby,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
  ];

  return (
    <section id="services" className="py-16 bg-white border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
            Our Pharmacy Services
          </h2>
          <div className="w-12 h-1 bg-emerald-500 rounded-full mx-auto mt-2.5 mb-3" />
          <p className="text-sm text-slate-500">
            Dedicated healthcare support for Bargokulpur, Kharagpur families with verified authenticity and compassionate guidance.
          </p>
        </div>

        {/* 4 Cards Grid matching Vibrant Palette */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border ${svc.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {svc.description}
                  </p>
                </div>

                <button
                  onClick={() => onCategorySelect(svc.category)}
                  className="mt-6 inline-flex items-center text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors pt-2 border-t border-emerald-100 cursor-pointer"
                >
                  <span>Explore Medicines</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Lower 4-Column Feature Grid matching Vibrant theme */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Fast Doorstep Delivery */}
          <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/50 rounded-2xl p-6 border border-emerald-100 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                Fast Doorstep Delivery
              </span>
              <h4 className="text-base font-extrabold text-emerald-950">
                Free Local Delivery
              </h4>
              <div className="mt-3 flex items-baseline space-x-1.5">
                <span className="text-xs text-slate-500">Orders above</span>
                <span className="text-2xl font-black text-emerald-600">₹300</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Delivering safely to homes across Bargokulpur, Kharagpur and adjoining areas.
              </p>
            </div>
            <button
              onClick={onOrderClick}
              className="mt-5 w-full py-2.5 px-3 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-emerald-900 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all cursor-pointer shadow-2xs"
            >
              Browse Catalog
            </button>
          </div>

          {/* Card 2: Why Choose Us? */}
          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-xs">
            <h4 className="text-base font-extrabold text-emerald-950 mb-3.5">
              Why Choose Us?
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Genuine & Batch Verified</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Qualified Pharmacist Guidance</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Doctor Prescription Compliance</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fair & Discounted MRP Prices</span>
              </li>
            </ul>
            <a
              href="#about"
              className="mt-4 inline-block text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              Learn More →
            </a>
          </div>

          {/* Card 3: Prescription Upload CTA */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl p-6 flex flex-col justify-between shadow-md">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3">
                <FileCheck className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-base font-extrabold text-white">
                Have a Prescription?
              </h4>
              <p className="text-xs text-emerald-50 mt-2 leading-relaxed">
                Take a quick photo of your doctor's slip. We will verify medicines and deliver quickly.
              </p>
            </div>
            <button
              onClick={onUploadRxClick}
              className="mt-5 w-full py-2.5 px-3 rounded-xl bg-white text-emerald-800 text-xs font-extrabold hover:bg-emerald-50 transition-all cursor-pointer shadow-sm"
            >
              Upload Prescription Now
            </button>
          </div>

          {/* Card 4: Urgent Phone / Shop hours */}
          <div className="bg-emerald-950 text-white rounded-2xl p-6 flex flex-col justify-between shadow-md border border-emerald-900">
            <div>
              <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold mb-2">
                <Clock className="w-4 h-4" />
                <span>Open 7 Days a Week</span>
              </div>
              <h4 className="text-base font-extrabold text-white">
                Need Medicines Urgently?
              </h4>
              <div className="text-2xl font-black text-amber-300 mt-1">
                +91 70293 50061
              </div>
              <p className="text-xs text-emerald-300/80 mt-2">
                Morning: 7 AM – 12 PM<br />
                Evening: 4 PM – 8 PM
              </p>
            </div>
            <a
              href={`tel:${shopSettings.phone}`}
              className="mt-5 w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black text-center transition-all cursor-pointer block shadow-sm"
            >
              Call Store Now
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
