import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Phone,
  User,
  Truck,
  Store,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  FileText,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { OrderItem } from '../types';

interface CartDrawerProps {
  onOrderSuccess: (orderId: string) => void;
  onOpenPrescription: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onOrderSuccess,
  onOpenPrescription,
}) => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryType,
    setDeliveryType,
    deliveryFee,
    grandTotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const { user, userProfile } = useAuth();
  const { createOrder } = useStore();

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [customerName, setCustomerName] = useState(user?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(
    userProfile?.address
      ? `${userProfile.address}, ${userProfile.city || 'Kharagpur'}`
      : 'Bargokulpur, Kharagpur'
  );
  const [pincode, setPincode] = useState(userProfile?.pincode || '721301');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isCartOpen) return null;

  // Check if any product requires prescription
  const hasRxProducts = items.some((i) => i.product.requiresPrescription);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerPhone || customerPhone.length < 10) {
      setErrorMsg('Please provide a valid 10-digit phone number.');
      return;
    }

    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMsg('Please provide your local delivery address in Kharagpur.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const orderItems: OrderItem[] = items.map((i) => ({
      productId: i.product.id,
      name: i.product.name,
      genericName: i.product.genericName,
      price: i.product.discountPrice ?? i.product.price,
      quantity: i.quantity,
      packSize: i.product.packSize,
    }));

    try {
      const orderId = await createOrder({
        customerUid: user?.uid || 'guest',
        customerName: customerName || 'Customer',
        customerPhone,
        customerEmail: user?.email || '',
        deliveryType,
        deliveryAddress:
          deliveryType === 'delivery'
            ? `${deliveryAddress}, PIN: ${pincode}`
            : 'Store Pickup at Midhya Medical Store, Bargokulpur',
        city: 'Kharagpur',
        pincode,
        items: orderItems,
        subtotal,
        deliveryFee,
        totalAmount: grandTotal,
        notes: orderNotes,
      });

      clearCart();
      setIsSubmitting(false);
      setIsCartOpen(false);
      setStep('cart');
      onOrderSuccess(orderId);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMsg('Failed to place order. Please try again or WhatsApp us.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/40">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-base">
              {step === 'cart' ? `Shopping Cart (${items.length})` : 'Delivery & Checkout'}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsCartOpen(false);
              setStep('cart');
            }}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Prescription Required Notice if cart contains Rx items */}
        {hasRxProducts && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Cart includes prescription items</span>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                onOpenPrescription();
              }}
              className="font-bold text-emerald-700 hover:underline shrink-0 cursor-pointer"
            >
              Upload Rx
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Your cart is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Add genuine medicines, baby products, or healthcare essentials to your order.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-xs"
              >
                Browse Medicines
              </button>
            </div>
          ) : step === 'cart' ? (
            <div className="space-y-3">
              {items.map((item) => {
                const unitPrice = item.product.discountPrice ?? item.product.price;
                return (
                  <div
                    key={item.product.id}
                    className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-xl bg-white shrink-0 border border-slate-200"
                    />

                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 truncate">
                        {item.product.name}
                      </h5>
                      <div className="text-[11px] text-slate-500 truncate">
                        {item.product.packSize}
                      </div>
                      <div className="text-xs font-extrabold text-emerald-700 mt-1">
                        ₹{unitPrice} × {item.quantity} = ₹{unitPrice * item.quantity}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-1.5 shrink-0">
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Delivery method selector */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Choose Fulfillment Option
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                      deliveryType === 'delivery'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Truck className="w-5 h-5 mb-1 text-emerald-600" />
                    <span>Home Delivery</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      {subtotal >= 300 ? 'Free (> ₹300)' : '₹25 Local'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                      deliveryType === 'pickup'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Store className="w-5 h-5 mb-1 text-emerald-600" />
                    <span>Store Pickup</span>
                    <span className="text-[10px] text-emerald-700 font-bold mt-0.5">
                      Free (Quick Pack)
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-3.5 text-xs">
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Recipient Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Phone Number (for order updates & delivery) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  />
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {deliveryType === 'delivery' ? (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Delivery Address (Bargokulpur / Kharagpur) *
                    </label>
                    <div className="relative">
                      <textarea
                        rows={2}
                        required
                        placeholder="House no., street, landmark in Bargokulpur or Kharagpur..."
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500"
                      />
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    </div>
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
                </>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-emerald-950 flex items-center">
                    <Store className="w-4 h-4 mr-1.5 text-emerald-700" />
                    Pickup from Midhya Medical Store
                  </div>
                  <p className="text-emerald-900 text-[11px]">
                    Bargokulpur, Kharagpur, Paschim Medinipur - 721301. We will pack your order and have it ready at the counter!
                  </p>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Order Notes (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call before arrival, deliver after 4 PM"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Payment on Delivery / Pickup:</div>
                <div>Pay via Cash, Google Pay, PhonePe, or UPI upon receiving medicines.</div>
              </div>
            </form>
          )}
        </div>

        {/* Footer & Checkout Buttons */}
        {items.length > 0 && (
          <div className="p-4 border-t border-emerald-100 bg-slate-50 space-y-3">
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="font-bold text-slate-800">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-emerald-700 text-base">₹{grandTotal}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Continue Shopping
                </button>
                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center space-x-1 shadow-xs cursor-pointer"
                >
                  <span>Proceed</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-extrabold flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Placing Your Order...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Place Order (₹{grandTotal})</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="w-full py-2 text-center text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  ← Back to Cart
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
