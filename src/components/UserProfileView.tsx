import React, { useState } from 'react';
import {
  X,
  User,
  MapPin,
  Phone,
  Package,
  FileText,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { OrderStatus, PrescriptionStatus } from '../types';

interface UserProfileViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ isOpen, onClose }) => {
  const { user, userProfile, logout, updateProfileAddress } = useAuth();
  const { userOrders, userPrescriptions } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'prescriptions' | 'address'>('orders');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [city, setCity] = useState(userProfile?.city || 'Kharagpur');
  const [pincode, setPincode] = useState(userProfile?.pincode || '721301');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen || !user) return null;

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfileAddress(address, city, pincode, phone);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  const getOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">Delivered</span>;
      case 'out_for_delivery':
        return <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[11px]">Out for Delivery</span>;
      case 'packed':
        return <span className="bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded text-[11px]">Packed & Ready</span>;
      case 'confirmed':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">Confirmed</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[11px]">Cancelled</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px]">Pending Review</span>;
    }
  };

  const getRxStatusBadge = (status: PrescriptionStatus) => {
    switch (status) {
      case 'dispensed':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">Dispensed</span>;
      case 'verified_quoted':
        return <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[11px]">Verified & Quoted</span>;
      case 'rejected':
        return <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[11px]">Invalid / Rejected</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px]">Under Pharmacist Review</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        
        {/* Profile Header */}
        <div className="bg-slate-900 text-white p-6 relative flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3.5">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-14 h-14 rounded-full border-2 border-emerald-400 object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-bold">
                {user.displayName?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <h3 className="text-lg font-extrabold">{user.displayName || 'Customer'}</h3>
              <p className="text-xs text-slate-300">{user.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                  {userProfile?.role === 'admin' ? 'Admin Access' : 'Verified Customer'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={async () => {
              await logout();
              onClose();
            }}
            className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border border-slate-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'orders'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>My Orders ({userOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'prescriptions'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>My Prescriptions ({userPrescriptions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('address')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'address'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Saved Address</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {userOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-700">No orders placed yet</p>
                  <p className="mt-1">Add items to cart and choose delivery or store pickup.</p>
                </div>
              ) : (
                userOrders.map((order) => (
                  <div key={order.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                      <div>
                        <span className="font-mono font-bold text-emerald-700 text-sm">{order.id}</span>
                        <div className="text-[11px] text-slate-500">
                          {new Date(order.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getOrderStatusBadge(order.status)}
                        <span className="font-black text-slate-900 text-sm">₹{order.totalAmount}</span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-slate-700">
                          <span>{item.quantity}× {item.name} ({item.packSize})</span>
                          <span className="font-semibold text-slate-900">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{order.deliveryAddress}</span>
                      <span className="font-semibold uppercase text-emerald-700">{order.deliveryType}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="space-y-4">
              {userPrescriptions.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-700">No prescriptions uploaded yet</p>
                  <p className="mt-1">Upload your doctor's slip to have our pharmacist dispense medicines.</p>
                </div>
              ) : (
                userPrescriptions.map((rx) => (
                  <div key={rx.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                      <div>
                        <span className="font-mono font-bold text-emerald-700 text-sm">{rx.id}</span>
                        <div className="text-[11px] text-slate-500">
                          Uploaded on {new Date(rx.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </div>
                      </div>
                      {getRxStatusBadge(rx.status)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      {rx.prescriptionImageData && (
                        <div className="h-32 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center">
                          <img
                            src={rx.prescriptionImageData}
                            alt="Prescription"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      )}
                      <div className="space-y-1.5">
                        <div>
                          <span className="font-bold text-slate-800">Patient: </span>
                          <span className="text-slate-600">{rx.patientName} {rx.patientAge ? `(${rx.patientAge})` : ''}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-800">Phone: </span>
                          <span className="text-slate-600">{rx.customerPhone}</span>
                        </div>
                        {rx.pharmacistNotes && (
                          <div className="bg-white p-2.5 rounded-lg border border-emerald-200 text-emerald-950">
                            <span className="font-bold block">Pharmacist Note:</span>
                            <span>{rx.pharmacistNotes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'address' && (
            <form onSubmit={handleSaveAddress} className="space-y-4 max-w-md text-xs">
              {saveSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Delivery details saved successfully!</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Contact Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Street / Area Address in Kharagpur *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Bargokulpur, Near Medical Store, House No..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Pin Code
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center space-x-2 cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Details'}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
