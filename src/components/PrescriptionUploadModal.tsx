import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Phone,
  User,
  MapPin,
  MessageCircle,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

interface PrescriptionUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (prescriptionId: string) => void;
}

export const PrescriptionUploadModal: React.FC<PrescriptionUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, userProfile } = useAuth();
  const { submitPrescription } = useStore();

  const [patientName, setPatientName] = useState(user?.displayName || '');
  const [patientAge, setPatientAge] = useState('');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(
    userProfile?.address
      ? `${userProfile.address}, ${userProfile.city || 'Kharagpur'}`
      : 'Bargokulpur, Kharagpur'
  );
  const [notes, setNotes] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload an image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size should be less than 5MB.');
      return;
    }

    setFileName(file.name);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewImage) {
      setErrorMsg('Please select or capture a photo of your doctor prescription.');
      return;
    }

    if (!customerPhone || customerPhone.length < 10) {
      setErrorMsg('Please provide a valid 10-digit phone number for pharmacist verification.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const rxId = await submitPrescription({
        customerUid: user?.uid || 'guest',
        customerName: patientName || 'Customer',
        customerPhone,
        customerEmail: user?.email || '',
        patientName: patientName || 'Customer',
        patientAge,
        deliveryAddress,
        prescriptionImageData: previewImage,
        fileName,
        pharmacistNotes: notes,
      });

      setIsSubmitting(false);
      onSuccess(rxId);
    } catch (err: any) {
      console.error('Failed to submit prescription:', err);
      setErrorMsg('Could not upload prescription. Please try again or WhatsApp us directly.');
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppForward = () => {
    const text = `Hello Midhya Medical Store,\n\nI want to order medicines with my prescription.\nPatient Name: ${patientName || 'Patient'}\nPhone: ${customerPhone}\nAddress: ${deliveryAddress}\nNotes: ${notes || 'Please verify and quote.'}`;
    window.open(`https://wa.me/917029350061?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 relative">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-emerald-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Upload Doctor's Prescription
              </h3>
              <p className="text-xs text-slate-500">
                Verified by certified pharmacists at Midhya Medical Store
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Upload Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Prescription Photo (Doctor's Slip / Slip / Rx) *
            </label>

            {previewImage ? (
              <div className="relative rounded-2xl border border-emerald-200 overflow-hidden bg-slate-50 p-2">
                <img
                  src={previewImage}
                  alt="Prescription preview"
                  className="max-h-56 mx-auto rounded-xl object-contain"
                />
                <div className="mt-2 flex items-center justify-between px-2 text-xs">
                  <span className="font-semibold text-emerald-900 truncate max-w-[200px]">
                    {fileName || 'prescription.jpg'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setFileName('');
                    }}
                    className="text-rose-600 hover:text-rose-700 font-bold"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/40 rounded-2xl p-6 text-center cursor-pointer block transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <UploadCloud className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <span className="text-sm font-bold text-slate-800 block">
                  Click or drag photo here
                </span>
                <span className="text-xs text-slate-400 block mt-1">
                  Supports JPG, PNG, camera snapshot (Max 5MB)
                </span>
              </label>
            )}
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Patient Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Ghosh"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500"
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Patient Age / Gender
              </label>
              <input
                type="text"
                placeholder="e.g. 42 Yrs / Male"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Contact & Delivery */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Contact Phone Number (for verification call) *
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500"
              />
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Delivery / Pickup Address in Kharagpur *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Bargokulpur, Near Railway Gate, Kharagpur"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500"
              />
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Special Instructions / Required Days of Medicine
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Need 1 month course, call before packing, preferred delivery morning..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Security & Regulatory Notice */}
          <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Pharmacist Verification Process
            </div>
            <p>
              Our registered pharmacist will review the prescription dosage, confirm stock availability, and call or WhatsApp you with the total bill before dispatch.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-extrabold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 text-sm cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting to Pharmacist...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Submit Prescription for Verification</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleWhatsAppForward}
              className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 text-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Or Send Directly on WhatsApp (+91 70293 50061)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
