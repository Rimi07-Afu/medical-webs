export interface Product {
  id: string;
  name: string;
  genericName: string;
  category: string;
  price: number;
  discountPrice?: number;
  packSize: string;
  manufacturer: string;
  dosage?: string;
  requiresPrescription: boolean;
  inStock: boolean;
  stockCount: number;
  imageUrl: string;
  description: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  genericName?: string;
  price: number;
  quantity: number;
  packSize: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'packed' | 'out_for_delivery' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customerUid?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress: string;
  city?: string;
  pincode?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type PrescriptionStatus = 'submitted' | 'under_review' | 'verified_quoted' | 'dispensed' | 'rejected';

export interface Prescription {
  id: string;
  customerUid?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  patientName: string;
  patientAge?: string;
  deliveryAddress: string;
  prescriptionImageData: string; // data URL or image link
  fileName?: string;
  status: PrescriptionStatus;
  pharmacistNotes?: string;
  estimatedTotal?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  role?: 'customer' | 'admin';
  createdAt?: string;
}

export interface ShopSettings {
  name: string;
  phone: string;
  whatsapp: string;
  address: string;
  googleMapsUrl: string;
  morningShift: string;
  eveningShift: string;
  daysOpen: string;
  isOpen: boolean;
  announcement?: string;
  pincode: string;
}
