import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ProductCatalog } from './components/ProductCatalog';
import { AboutContactSection } from './components/AboutContactSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { PrescriptionUploadModal } from './components/PrescriptionUploadModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileView } from './components/UserProfileView';
import { AdminDashboard } from './components/AdminDashboard';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { Product } from './types';
import { MessageCircle, Phone, ArrowUp } from 'lucide-react';

function MainStoreApp() {
  const { setSelectedCategory } = useStore();

  // Modals & Drawers state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Success Confirmation State
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [successPrescriptionId, setSuccessPrescriptionId] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    scrollToSection('products');
  };

  return (
    <div className="min-h-screen bg-emerald-50/40 text-slate-900 flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Global Navigation Header */}
      <Header
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        
        {/* Hero Section matching design reference */}
        <Hero
          onOrderClick={() => scrollToSection('products')}
          onUploadRxClick={() => setIsPrescriptionOpen(true)}
        />

        {/* 4 Pharmacy Services Cards & Trust Columns matching design reference */}
        <ServicesSection
          onCategorySelect={handleCategorySelect}
          onUploadRxClick={() => setIsPrescriptionOpen(true)}
          onOrderClick={() => scrollToSection('products')}
        />

        {/* Searchable Medicine & Healthcare Products Catalog */}
        <ProductCatalog
          onSelectProduct={(product) => setSelectedProduct(product)}
          onUploadRxClick={() => setIsPrescriptionOpen(true)}
        />

        {/* About Midhya Medical Store, Hours, and Google Maps Location */}
        <AboutContactSection />

      </main>

      {/* Global Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
        onNavigateProducts={() => scrollToSection('products')}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col space-y-2 items-end">
        <a
          href={`https://wa.me/917029350061?text=${encodeURIComponent('Hello Midhya Medical Store, I need to inquire about medicines.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg shadow-emerald-600/30 hover:shadow-xl transition-all duration-200"
          title="Chat with Midhya Medical Store on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 sm:mr-2" />
          <span className="hidden sm:inline text-xs font-black tracking-wide">
            WhatsApp Store
          </span>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400" />
          </span>
        </a>
      </div>

      {/* Slide-over Cart & Checkout Drawer */}
      <CartDrawer
        onOrderSuccess={(orderId) => setSuccessOrderId(orderId)}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
      />

      {/* Doctor Prescription Upload Modal */}
      <PrescriptionUploadModal
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
        onSuccess={(rxId) => {
          setIsPrescriptionOpen(false);
          setSuccessPrescriptionId(rxId);
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
      />

      {/* Firebase Google Sign In Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Customer Profile & Past Orders Modal */}
      <UserProfileView
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Complete Pharmacist & Owner Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Order / Prescription Placement Confirmation Modal */}
      <OrderSuccessModal
        orderId={successOrderId}
        prescriptionId={successPrescriptionId}
        onClose={() => {
          setSuccessOrderId(null);
          setSuccessPrescriptionId(null);
        }}
        onViewOrders={() => {
          setSuccessOrderId(null);
          setSuccessPrescriptionId(null);
          setIsProfileOpen(true);
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <MainStoreApp />
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
