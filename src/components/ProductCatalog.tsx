import React, { useState } from 'react';
import {
  Search,
  Filter,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  AlertCircle,
  FileText,
  Eye,
  Info,
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void;
  onUploadRxClick: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onSelectProduct,
  onUploadRxClick,
}) => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    loadingProducts,
  } = useStore();

  const { items, addToCart, updateQuantity } = useCart();
  const [filterRxOnly, setFilterRxOnly] = useState<'all' | 'rx' | 'otc'>('all');

  // Filter with Rx toggle
  const displayedProducts = filteredProducts.filter((product) => {
    if (filterRxOnly === 'rx') return product.requiresPrescription;
    if (filterRxOnly === 'otc') return !product.requiresPrescription;
    return true;
  });

  const getCartQuantity = (productId: string) => {
    const item = items.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <section id="products" className="py-16 bg-emerald-50/50 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Title & Prescription Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <span>Verified Medicine Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
              Medicines & Healthcare Products
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Search by brand, generic salt, or category. All medicines dispensed strictly by registered pharmacists.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onUploadRxClick}
              className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 mr-1.5" />
              Upload Doctor's Prescription
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-emerald-100 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search input */}
            <div className="relative w-full md:max-w-md">
              <input
                type="text"
                placeholder="Search by medicine name, salt (e.g. Paracetamol), or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-emerald-100 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Type selector: All vs Prescription vs OTC */}
            <div className="flex items-center space-x-1.5 self-start md:self-auto bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setFilterRxOnly('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterRxOnly === 'all' ? 'bg-white text-emerald-950 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => setFilterRxOnly('otc')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterRxOnly === 'otc' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                OTC (No Rx)
              </button>
              <button
                onClick={() => setFilterRxOnly('rx')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterRxOnly === 'rx' ? 'bg-white text-rose-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rx Required
              </button>
            </div>
          </div>

          {/* Category horizontal scrolling pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 border border-emerald-100 animate-pulse space-y-3">
                <div className="w-full h-44 bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded-sm w-3/4" />
                <div className="h-3 bg-slate-200 rounded-sm w-1/2" />
                <div className="h-8 bg-slate-200 rounded-lg mt-4" />
              </div>
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-emerald-100 p-8">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No medicines found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
              We couldn't find any product matching "{searchQuery || selectedCategory}". You can upload your prescription or contact us directly on WhatsApp!
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setFilterRxOnly('all');
                }}
                className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-lg hover:bg-emerald-100 cursor-pointer"
              >
                Reset Filters
              </button>
              <a
                href="https://wa.me/917029350061"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
              >
                Inquire on WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => {
              const inCartQty = getCartQuantity(product.id);
              const hasDiscount = product.discountPrice && product.discountPrice < product.price;
              const displayPrice = product.discountPrice ?? product.price;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Image with badges */}
                    <div className="relative w-full h-44 bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onSelectProduct(product)}>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      
                      {/* Rx / OTC Badge */}
                      <div className="absolute top-2.5 left-2.5">
                        {product.requiresPrescription ? (
                          <span className="inline-flex items-center bg-rose-600/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                            Rx Required
                          </span>
                        ) : (
                          <span className="inline-flex items-center bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                            OTC
                          </span>
                        )}
                      </div>

                      {/* Quick view button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(product);
                        }}
                        className="absolute top-2.5 right-2.5 bg-white/90 hover:bg-white text-slate-700 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Pack Size pill */}
                      <div className="absolute bottom-2 left-2 bg-slate-900/75 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-medium">
                        {product.packSize}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-1.5">
                      <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider truncate">
                        {product.category}
                      </div>

                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1 cursor-pointer"
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                        {product.genericName}
                      </p>

                      <div className="text-[10px] text-slate-400 truncate">
                        Mfr: {product.manufacturer}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Add to Cart button matching Vibrant theme */}
                  <div className="p-4 pt-0 border-t border-emerald-50 mt-2">
                    <div className="flex items-baseline space-x-2 mb-3 pt-3">
                      <span className="text-base font-extrabold text-slate-900">
                        ₹{displayPrice}
                      </span>
                      {hasDiscount && (
                        <>
                          <span className="text-xs text-slate-400 line-through">
                            ₹{product.price}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Save ₹{product.price - product.discountPrice!}
                          </span>
                        </>
                      )}
                    </div>

                    {inCartQty > 0 ? (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(product.id, inCartQty - 1)}
                          className="w-8 h-8 rounded-lg bg-white text-emerald-800 font-bold flex items-center justify-center hover:bg-emerald-100 transition-colors shadow-2xs cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-emerald-950 px-2">
                          {inCartQty} in cart
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, inCartQty + 1)}
                          className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs hover:shadow-md"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
