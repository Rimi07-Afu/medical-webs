import React, { useState } from 'react';
import {
  X,
  Package,
  ShoppingBag,
  FileText,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  Phone,
  MessageCircle,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Search,
  Store,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Order, Prescription, ShopSettings, OrderStatus, PrescriptionStatus } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const {
    products,
    categories,
    allOrders,
    allPrescriptions,
    shopSettings,
    adminUpdateOrderStatus,
    adminUpdatePrescription,
    adminSaveProduct,
    adminDeleteProduct,
    adminUpdateShopSettings,
    seedInitialInventory,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'prescriptions' | 'settings'>('orders');

  // Product Editing / Adding State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Settings State
  const [settingsForm, setSettingsForm] = useState<ShopSettings>(shopSettings);

  // Order status filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Prescription inspection
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [rxNotes, setRxNotes] = useState('');

  if (!isOpen) return null;

  const triggerSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await adminSaveProduct(editingProduct);
      setEditingProduct(null);
      setIsAddingProduct(false);
      triggerSuccess('Product saved successfully to inventory!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product from the store catalog?')) return;
    try {
      await adminDeleteProduct(id);
      triggerSuccess('Product removed from catalog.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeed = async () => {
    if (!confirm('This will seed the database with 16 authentic Indian medicines and store settings. Continue?')) return;
    try {
      await seedInitialInventory();
      triggerSuccess('Inventory seeded successfully with authentic medicines!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminUpdateShopSettings(settingsForm);
      triggerSuccess('Shop settings and hours updated successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRx = async (rx: Prescription, newStatus: PrescriptionStatus) => {
    try {
      await adminUpdatePrescription(rx.id, newStatus, rxNotes || rx.pharmacistNotes || '');
      triggerSuccess(`Prescription status set to ${newStatus}`);
      if (selectedRx?.id === rx.id) {
        setSelectedRx({ ...selectedRx, status: newStatus, pharmacistNotes: rxNotes });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = allOrders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  const filteredCatalog = products.filter((p) => {
    const q = productSearch.toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.genericName.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-6xl w-full h-[94vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Admin Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
              M
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-extrabold text-base sm:text-lg">Midhya Medical Store — Admin Portal</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  Live Management
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage medicines, customer orders, prescriptions, stock & shop timings
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSeed}
              className="hidden sm:inline-flex items-center space-x-1.5 bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-600/40 cursor-pointer"
              title="Seed 16 authentic Indian medicines to Firestore"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset/Seed Catalog</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Action Message */}
        {actionSuccess && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-6 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionSuccess}</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100 px-6 text-xs font-bold gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({allOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'prescriptions'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Prescriptions ({allPrescriptions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory & Prices ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Shop Info & Hours</span>
          </button>
        </div>

        {/* Tab Content Areas */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Filter */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center space-x-2 text-xs font-semibold">
                  <span className="text-slate-500">Filter Status:</span>
                  {(['all', 'pending', 'confirmed', 'packed', 'out_for_delivery', 'completed', 'cancelled'] as const).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => setOrderStatusFilter(st)}
                        className={`px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                          orderStatusFilter === st
                            ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {st.replace(/_/g, ' ')}
                      </button>
                    )
                  )}
                </div>
                <div className="text-xs text-slate-500 font-bold">
                  Showing {filteredOrders.length} orders
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-700 text-sm">No orders matching status</p>
                  <p>When customers order medicines, they appear here instantly.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 text-xs">
                      <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                        <div>
                          <div className="font-mono font-black text-sm text-emerald-700">{order.id}</div>
                          <div className="text-[11px] text-slate-400">
                            {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black text-slate-900">₹{order.totalAmount}</span>
                          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{order.deliveryType}</div>
                        </div>
                      </div>

                      {/* Customer contact */}
                      <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl">
                        <div className="font-bold text-slate-800 flex items-center justify-between">
                          <span>{order.customerName}</span>
                          <div className="flex space-x-2">
                            <a
                              href={`tel:${order.customerPhone}`}
                              className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center"
                            >
                              <Phone className="w-3 h-3 mr-1" />
                              {order.customerPhone}
                            </a>
                            <a
                              href={`https://wa.me/91${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${order.customerName}, regarding your Midhya Medical Store order ${order.id}:`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                        <div className="text-slate-600 text-[11px]">{order.deliveryAddress}</div>
                        {order.notes && (
                          <div className="text-amber-800 text-[11px] italic">Note: "{order.notes}"</div>
                        )}
                      </div>

                      {/* Items */}
                      <div className="space-y-1 border-t border-slate-100 pt-2 max-h-36 overflow-y-auto">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-slate-700">
                            <span>{it.quantity}× {it.name}</span>
                            <span className="font-semibold text-slate-900">₹{it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Status changer */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-700">Update Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => adminUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="bg-slate-100 border border-slate-300 font-bold text-slate-800 rounded-lg px-2.5 py-1 text-xs focus:outline-hidden focus:border-emerald-500"
                        >
                          <option value="pending">Pending Review</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="packed">Packed</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="completed">Completed / Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRESCRIPTIONS */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-4">
              {allPrescriptions.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-700 text-sm">No prescriptions submitted yet</p>
                  <p>When patients upload prescriptions, they will be listed here with photo view.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allPrescriptions.map((rx) => (
                    <div key={rx.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 text-xs">
                      <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                        <div>
                          <div className="font-mono font-black text-sm text-emerald-700">{rx.id}</div>
                          <div className="text-[11px] text-slate-400">
                            {new Date(rx.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </div>
                        </div>
                        <span className="font-bold px-2 py-0.5 rounded capitalize bg-emerald-50 text-emerald-800">
                          {rx.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {rx.prescriptionImageData ? (
                          <div
                            onClick={() => setSelectedRx(rx)}
                            className="h-28 bg-slate-100 rounded-xl overflow-hidden cursor-pointer border border-slate-200 hover:opacity-90 relative group"
                          >
                            <img
                              src={rx.prescriptionImageData}
                              alt="Prescription"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                              Click to Enlarge
                            </div>
                          </div>
                        ) : (
                          <div className="h-28 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                            No Image
                          </div>
                        )}

                        <div className="col-span-2 space-y-1">
                          <div className="font-bold text-slate-900">{rx.patientName} {rx.patientAge ? `(${rx.patientAge})` : ''}</div>
                          <div className="flex items-center space-x-2">
                            <a href={`tel:${rx.customerPhone}`} className="text-emerald-700 font-bold flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {rx.customerPhone}
                            </a>
                            <a
                              href={`https://wa.me/91${rx.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${rx.patientName}, this is Midhya Medical Store regarding your uploaded prescription (${rx.id}):`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 font-bold"
                            >
                              WhatsApp
                            </a>
                          </div>
                          <div className="text-[11px] text-slate-600 line-clamp-2">{rx.deliveryAddress}</div>
                          {rx.pharmacistNotes && (
                            <div className="text-emerald-950 bg-emerald-50 border border-emerald-100 p-1.5 rounded text-[11px]">
                              Note: {rx.pharmacistNotes}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status buttons */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateRx(rx, 'under_review')}
                          className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          Mark Under Review
                        </button>
                        <button
                          onClick={() => handleUpdateRx(rx, 'verified_quoted')}
                          className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          Mark Verified
                        </button>
                        <button
                          onClick={() => handleUpdateRx(rx, 'dispensed')}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          Mark Dispensed
                        </button>
                        <button
                          onClick={() => handleUpdateRx(rx, 'rejected')}
                          className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCTS & INVENTORY */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setEditingProduct({
                        id: `prod-${Date.now()}`,
                        name: '',
                        genericName: '',
                        category: 'Fever & Pain Relief',
                        price: 100,
                        discountPrice: 90,
                        packSize: '10 Tablets / Strip',
                        manufacturer: 'Cipla Ltd',
                        requiresPrescription: false,
                        inStock: true,
                        stockCount: 50,
                        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
                        description: '',
                      });
                      setIsAddingProduct(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Medicine</span>
                  </button>
                </div>
              </div>

              {/* Product Edit / Add Modal */}
              {(isAddingProduct || editingProduct) && (
                <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500 shadow-lg space-y-4 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-sm text-slate-900">
                      {isAddingProduct ? 'Add Medicine / Product' : `Edit ${editingProduct?.name}`}
                    </h3>
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setIsAddingProduct(false);
                      }}
                      className="text-slate-400 hover:text-slate-600 font-bold"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleSaveProductForm} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Medicine Name *</label>
                      <input
                        type="text"
                        required
                        value={editingProduct?.name || ''}
                        onChange={(e) => setEditingProduct((p) => (p ? { ...p, name: e.target.value } : null))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Generic / Salt Formula *</label>
                      <input
                        type="text"
                        required
                        value={editingProduct?.genericName || ''}
                        onChange={(e) => setEditingProduct((p) => (p ? { ...p, genericName: e.target.value } : null))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category *</label>
                      <input
                        type="text"
                        required
                        value={editingProduct?.category || ''}
                        onChange={(e) => setEditingProduct((p) => (p ? { ...p, category: e.target.value } : null))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">MRP Price (₹) *</label>
                      <input
                        type="number"
                        required
                        value={editingProduct?.price || 0}
                        onChange={(e) => setEditingProduct((p) => (p ? { ...p, price: Number(e.target.value) } : null))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Discount Price (₹)</label>
                      <input
                        type="number"
                        value={editingProduct?.discountPrice || 0}
                        onChange={(e) => setEditingProduct((p) => (p ? { ...p, discountPrice: Number(e.target.value) } : null))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Pack Size *</label>
                      <input
                        type="text"
                        required
                        value={editingProduct?.packSize || ''}
                        onChange={(e) => setEditingProduct((p) => (p ? { ...p, packSize: e.target.value } : null))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Manufacturer *</label>
                      <input
                        type="text"
                        required
                        value={editingProduct?.manufacturer || ''}
                        onChange={(e) => setEditingProduct((p) => (p ? { ...p, manufacturer: e.target.value } : null))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Stock Count</label>
                      <input
                        type="number"
                        value={editingProduct?.stockCount || 0}
                        onChange={(e) => setEditingProduct((p) => (p ? { ...p, stockCount: Number(e.target.value) } : null))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={editingProduct?.imageUrl || ''}
                        onChange={(e) => setEditingProduct((p) => (p ? { ...p, imageUrl: e.target.value } : null))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="col-span-full">
                      <label className="block font-bold text-slate-700 mb-1">Description / Indications</label>
                      <textarea
                        rows={2}
                        value={editingProduct?.description || ''}
                        onChange={(e) => setEditingProduct((p) => (p ? { ...p, description: e.target.value } : null))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="col-span-full flex items-center space-x-6 pt-1">
                      <label className="flex items-center space-x-2 font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct?.requiresPrescription || false}
                          onChange={(e) => setEditingProduct((p) => (p ? { ...p, requiresPrescription: e.target.checked } : null))}
                          className="w-4 h-4 text-emerald-600 rounded"
                        />
                        <span>Requires Doctor's Prescription (Rx)</span>
                      </label>

                      <label className="flex items-center space-x-2 font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct?.inStock ?? true}
                          onChange={(e) => setEditingProduct((p) => (p ? { ...p, inStock: e.target.checked } : null))}
                          className="w-4 h-4 text-emerald-600 rounded"
                        />
                        <span>Currently In Stock</span>
                      </label>
                    </div>

                    <div className="col-span-full pt-3">
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl flex items-center space-x-2 cursor-pointer shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Product Changes</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Medicine</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Stock</th>
                        <th className="p-3">Type</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {filteredCatalog.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50/80">
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{prod.name}</div>
                            <div className="text-[11px] text-slate-400 italic">{prod.genericName}</div>
                          </td>
                          <td className="p-3">{prod.category}</td>
                          <td className="p-3 font-bold">
                            ₹{prod.discountPrice ?? prod.price}
                            {prod.discountPrice && (
                              <span className="text-[10px] text-slate-400 line-through ml-1">
                                ₹{prod.price}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${prod.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                              {prod.inStock ? `${prod.stockCount} in stock` : 'Out of stock'}
                            </span>
                          </td>
                          <td className="p-3">
                            {prod.requiresPrescription ? (
                              <span className="text-rose-600 font-bold">Rx</span>
                            ) : (
                              <span className="text-emerald-600 font-semibold">OTC</span>
                            )}
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingProduct(prod);
                                setIsAddingProduct(false);
                              }}
                              className="text-emerald-600 hover:text-emerald-800 p-1 cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SHOP INFO & HOURS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
              <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                Business Information & Operational Timings
              </h3>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shop Legal Name</label>
                  <input
                    type="text"
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={settingsForm.whatsapp}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Physical Address in Kharagpur</label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Morning Shift Hours</label>
                    <input
                      type="text"
                      value={settingsForm.morningShift}
                      onChange={(e) => setSettingsForm({ ...settingsForm, morningShift: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Evening Shift Hours</label>
                    <input
                      type="text"
                      value={settingsForm.eveningShift}
                      onChange={(e) => setSettingsForm({ ...settingsForm, eveningShift: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Days Open</label>
                  <input
                    type="text"
                    value={settingsForm.daysOpen}
                    onChange={(e) => setSettingsForm({ ...settingsForm, daysOpen: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Store Announcement Banner</label>
                  <textarea
                    rows={2}
                    value={settingsForm.announcement || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl flex items-center space-x-2 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Store Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Prescription Zoom Modal */}
        {selectedRx && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="font-extrabold text-sm text-slate-900">
                  Prescription #{selectedRx.id} — {selectedRx.patientName}
                </h4>
                <button
                  onClick={() => setSelectedRx(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <div className="max-h-[60vh] overflow-auto bg-slate-100 rounded-xl p-2 flex justify-center">
                <img
                  src={selectedRx.prescriptionImageData}
                  alt="Doctor's Prescription"
                  className="max-h-full object-contain"
                />
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Add Pharmacist Response Note</label>
                  <input
                    type="text"
                    placeholder="e.g. All medicines ready. Total ₹340. Out for delivery."
                    value={rxNotes}
                    onChange={(e) => setRxNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => handleUpdateRx(selectedRx, 'verified_quoted')}
                    className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl cursor-pointer"
                  >
                    Save & Mark Verified
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
