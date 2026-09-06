import React, { useState } from 'react';
import {
  Phone,
  Clock,
  MapPin,
  ShoppingBag,
  FileText,
  User,
  ShieldCheck,
  Search,
  Menu,
  X,
  MessageCircle,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  onOpenPrescription: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  activeSection?: string;
  setActiveSection?: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPrescription,
  onOpenAuth,
  onOpenProfile,
  onOpenAdmin,
  activeSection = 'home',
  setActiveSection,
}) => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const { shopSettings, searchQuery, setSearchQuery } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine if currently open based on IST (UTC+5:30)
  const isShopOpenNow = () => {
    try {
      const now = new Date();
      // IST is UTC + 5:30
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const istTime = new Date(utc + 3600000 * 5.5);
      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      const timeInMinutes = hours * 60 + minutes;

      // 7:00 AM (420) to 12:00 PM (720) OR 4:00 PM (960) to 8:00 PM (1200)
      const morningOpen = timeInMinutes >= 420 && timeInMinutes <= 720;
      const eveningOpen = timeInMinutes >= 960 && timeInMinutes <= 1200;
      return morningOpen || eveningOpen;
    } catch {
      return true;
    }
  };

  const openNow = isShopOpenNow();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Medicines & Store' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact & Location' },
  ];

  const [currentSection, setCurrentSection] = useState(activeSection);
  const active = activeSection || currentSection;

  const handleNavClick = (id: string) => {
    setCurrentSection(id);
    setActiveSection?.(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-emerald-100">
      {/* Top utility bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 sm:px-8 border-b border-emerald-900">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-emerald-300 font-medium">
              <span className={`w-2 h-2 rounded-full mr-2 ${openNow ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              {openNow ? 'Open Now (7 AM–12 PM & 4 PM–8 PM)' : 'Opens at 7:00 AM / 4:00 PM'}
            </span>
            <span className="hidden sm:flex items-center text-emerald-400/80">
              <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              Bargokulpur, Kharagpur (721301)
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href={`tel:${shopSettings.phone}`}
              className="flex items-center hover:text-emerald-300 transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              {shopSettings.phone}
            </a>

            <a
              href={`https://wa.me/917029350061?text=${encodeURIComponent('Hello Midhya Medical Store, I want to inquire about medicines.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center text-emerald-300 hover:text-white font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              WhatsApp Orders
            </a>

            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center bg-emerald-800/60 text-emerald-200 hover:bg-emerald-800 px-2.5 py-0.5 rounded text-xs font-semibold border border-emerald-500/50 cursor-pointer"
              >
                <ShieldCheck className="w-3 h-3 mr-1" />
                Admin Dashboard
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo matching the Vibrant Palette emerald design */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center space-x-3 text-left group cursor-pointer focus:outline-hidden"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            {/* Pharmacy emblem */}
            <div className="relative flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white rounded-md flex items-center justify-center">
                <span className="text-base font-bold leading-none">+</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-2xl tracking-tight text-emerald-900">Midhya</span>
              <span className="text-emerald-600 font-bold text-2xl tracking-tight">Medical</span>
            </div>
            <p className="text-[11px] font-bold tracking-wider text-emerald-700 uppercase -mt-0.5">
              Pharmacy & Healthcare Store
            </p>
          </div>
        </button>

        {/* Desktop Nav links */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-sm font-semibold transition-colors cursor-pointer ${
                active === item.id
                  ? 'text-emerald-900 border-b-2 border-emerald-500 pb-1 font-bold'
                  : 'text-emerald-800 hover:text-emerald-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Quick Search */}
          <div className="relative hidden md:block w-48 xl:w-64">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (active !== 'products') {
                  setCurrentSection('products');
                  setActiveSection?.('products');
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 border border-emerald-100 rounded-full focus:bg-white focus:outline-hidden focus:border-emerald-500 transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Upload Prescription CTA */}
          <button
            onClick={onOpenPrescription}
            className="hidden sm:inline-flex items-center bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <FileText className="w-4 h-4 mr-1.5 text-emerald-600" />
            Upload Rx
          </button>

          {/* Cart Icon & Badge matching Vibrant theme */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping Cart"
            className="relative px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full transition-colors cursor-pointer flex items-center justify-center"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-xs">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Account / Profile */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center space-x-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors text-xs font-bold text-emerald-900 cursor-pointer"
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <span className="hidden md:inline max-w-[85px] truncate">
                {user.displayName?.split(' ')[0] || 'Account'}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center bg-emerald-600 text-white hover:bg-emerald-700 px-5 py-2 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5 mr-1.5" />
              Sign In
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden text-emerald-900 hover:bg-emerald-50 rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-emerald-100 bg-white px-4 py-4 space-y-3">
          {/* Mobile search */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveSection('products');
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 border border-emerald-100 rounded-xl focus:outline-hidden focus:border-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                onOpenPrescription();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center bg-emerald-50 text-emerald-800 py-2.5 px-3 rounded-xl text-xs font-bold border border-emerald-200"
            >
              <FileText className="w-4 h-4 mr-1.5 text-emerald-600" />
              Upload Rx
            </button>
            <a
              href={`https://wa.me/917029350061?text=${encodeURIComponent('Hello Midhya Medical Store, I need medicines.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 px-3 rounded-xl text-xs font-bold"
            >
              <MessageCircle className="w-4 h-4 mr-1.5" />
              WhatsApp
            </a>
          </div>

          <div className="space-y-1 pt-2 border-t border-emerald-100">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left py-2 px-3 rounded-md text-sm font-semibold ${
                  active === item.id ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-md text-sm font-semibold text-emerald-800 bg-emerald-50/80 flex items-center"
              >
                <ShieldCheck className="w-4 h-4 mr-2 text-emerald-600" />
                Admin Dashboard
              </button>
            )}

            {user ? (
              <button
                onClick={() => {
                  onOpenProfile();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-md text-sm font-semibold text-slate-700 flex items-center"
              >
                <User className="w-4 h-4 mr-2" />
                My Profile & Orders
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-md text-sm font-semibold text-emerald-600 flex items-center"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
