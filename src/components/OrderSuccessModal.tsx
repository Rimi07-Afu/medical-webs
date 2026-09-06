import React from 'react';
import { CheckCircle2, MessageCircle, Phone, MapPin, Clock, X, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface OrderSuccessModalProps {
  orderId: string | null;
  prescriptionId: string | null;
  onClose: () => void;
  onViewOrders: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  orderId,
  prescriptionId,
  onClose,
  onViewOrders,
}) => {
  const { shopSettings } = useStore();

  if (!orderId && !prescriptionId) return null;

  const isOrder = Boolean(orderId);
  const refId = orderId || prescriptionId;

  const handleWhatsApp = () => {
    const text = isOrder
      ? `Hello Midhya Medical Store,\n\nI just placed an order on your website!\nOrder ID: ${orderId}\nPlease confirm when it will be dispatched.\nThank you!`
      : `Hello Midhya Medical Store,\n\nI just uploaded a prescription on your website!\nPrescription ID: ${prescriptionId}\nPlease review and let me know the medicine availability.\nThank you!`;

    window.open(`https://wa.me/917029350061?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-100 relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-slate-900">
            {isOrder ? 'Order Placed Successfully!' : 'Prescription Uploaded!'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isOrder
              ? 'Thank you for choosing Midhya Medical Store. Our team is preparing your medicines.'
              : 'Our registered pharmacist has received your prescription and will verify it shortly.'}
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-2 text-left">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-medium">Reference ID:</span>
            <span className="font-mono font-bold text-emerald-700">{refId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Status:</span>
            <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              {isOrder ? 'Pending Pharmacist Review' : 'Under Review'}
            </span>
          </div>
          <div className="flex items-start space-x-1 text-slate-600 pt-1">
            <Clock className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0 mt-0.5" />
            <span>Estimated response: within 15–30 minutes during shop hours (7 AM–12 PM & 4 PM–8 PM).</span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={handleWhatsApp}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Notify Store on WhatsApp (+91 70293 50061)</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onViewOrders();
            }}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>View in My Orders / Prescriptions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
