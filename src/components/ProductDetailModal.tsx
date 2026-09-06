import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, AlertCircle, Plus, Minus, FileText, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenPrescription: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenPrescription,
}) => {
  const { items, addToCart, updateQuantity } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const inCart = items.find((i) => i.product.id === product.id);
  const displayPrice = product.discountPrice ?? product.price;

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative h-64 md:h-full min-h-[260px] bg-slate-100">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col space-y-1.5">
              {product.requiresPrescription ? (
                <span className="bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5 mr-1" />
                  Rx Required
                </span>
              ) : (
                <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                  Over The Counter (OTC)
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-md">
                {product.category}
              </span>

              <h2 className="text-xl font-extrabold text-slate-900">
                {product.name}
              </h2>

              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Salt / Formula: </span>
                {product.genericName}
              </div>

              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Pack: </span>
                {product.packSize}
              </div>

              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Manufacturer: </span>
                {product.manufacturer}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {product.description}
              </p>

              {product.dosage && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs">
                  <span className="font-bold text-slate-800 block mb-0.5">Usage & Dosage:</span>
                  <span className="text-slate-600">{product.dosage}</span>
                </div>
              )}

              {product.requiresPrescription && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-xs space-y-1">
                  <div className="font-bold flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                    Doctor's Prescription Needed
                  </div>
                  <p className="text-[11px] text-amber-800">
                    As per Indian drug regulations, a valid prescription from a registered medical practitioner is required for this medicine.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPrescription();
                    }}
                    className="mt-1 text-emerald-700 font-bold underline hover:text-emerald-900 cursor-pointer block"
                  >
                    Upload your prescription now →
                  </button>
                </div>
              )}
            </div>

            {/* Price & Cart Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900">
                  ₹{displayPrice}
                </span>
                {product.discountPrice && product.discountPrice < product.price && (
                  <>
                    <span className="text-sm text-slate-400 line-through">
                      ₹{product.price}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Save ₹{product.price - product.discountPrice}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-3">
                {inCart ? (
                  <div className="flex items-center justify-between w-full bg-emerald-50 border border-emerald-200 rounded-xl p-1.5">
                    <button
                      onClick={() => updateQuantity(product.id, inCart.quantity - 1)}
                      className="w-10 h-10 rounded-lg bg-white text-emerald-800 font-bold flex items-center justify-center hover:bg-emerald-100 shadow-2xs cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-emerald-950">
                      {inCart.quantity} in cart
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, inCart.quantity + 1)}
                      className="w-10 h-10 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center hover:bg-emerald-700 shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 text-sm shadow-md cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart (₹{displayPrice})</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
