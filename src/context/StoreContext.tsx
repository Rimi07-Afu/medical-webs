import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testConnection } from '../firebase';
import { Product, Order, Prescription, ShopSettings, OrderStatus, PrescriptionStatus } from '../types';
import { INITIAL_PRODUCTS, DEFAULT_SHOP_SETTINGS } from '../data/initialProducts';
import { useAuth } from './AuthContext';

interface StoreContextType {
  products: Product[];
  categories: string[];
  shopSettings: ShopSettings;
  loadingProducts: boolean;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredProducts: Product[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  submitPrescription: (data: Omit<Prescription, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  userOrders: Order[];
  userPrescriptions: Prescription[];
  allOrders: Order[];
  allPrescriptions: Prescription[];
  adminUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  adminUpdatePrescription: (prescriptionId: string, status: PrescriptionStatus, notes: string) => Promise<void>;
  adminSaveProduct: (product: Product) => Promise<void>;
  adminDeleteProduct: (productId: string) => Promise<void>;
  adminUpdateShopSettings: (settings: Partial<ShopSettings>) => Promise<void>;
  seedInitialInventory: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [shopSettings, setShopSettings] = useState<ShopSettings>(DEFAULT_SHOP_SETTINGS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [userPrescriptions, setUserPrescriptions] = useState<Prescription[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allPrescriptions, setAllPrescriptions] = useState<Prescription[]>([]);

  // 1. Initial connection check and setup listeners
  useEffect(() => {
    testConnection();

    // Listen to shop settings
    const settingsRef = doc(db, 'shopSettings', 'current');
    const unsubscribeSettings = onSnapshot(
      settingsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setShopSettings({ ...DEFAULT_SHOP_SETTINGS, ...(snapshot.data() as ShopSettings) });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'shopSettings/current');
      }
    );

    // Listen to products
    const productsRef = collection(db, 'products');
    const unsubscribeProducts = onSnapshot(
      productsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetched: Product[] = [];
          snapshot.forEach((d) => {
            fetched.push({ id: d.id, ...(d.data() as Omit<Product, 'id'>) });
          });
          setProducts(fetched);
        } else {
          // If empty, use initial dataset and offer auto-seed
          setProducts(INITIAL_PRODUCTS);
        }
        setLoadingProducts(false);
      },
      (error) => {
        console.warn('Error loading products from Firestore, using initial dataset:', error);
        setProducts(INITIAL_PRODUCTS);
        setLoadingProducts(false);
      }
    );

    return () => {
      unsubscribeSettings();
      unsubscribeProducts();
    };
  }, []);

  // 2. Listen to user-specific orders and prescriptions
  useEffect(() => {
    if (!user) {
      setUserOrders([]);
      setUserPrescriptions([]);
      return;
    }

    // Orders for current user
    const ordersQuery = query(
      collection(db, 'orders'),
      where('customerUid', '==', user.uid)
    );
    const unsubOrders = onSnapshot(
      ordersQuery,
      (snap) => {
        const list: Order[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<Order, 'id'>) }));
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setUserOrders(list);
      },
      (error) => {
        console.warn('Error fetching user orders:', error);
      }
    );

    // Prescriptions for current user
    const rxQuery = query(
      collection(db, 'prescriptions'),
      where('customerUid', '==', user.uid)
    );
    const unsubRx = onSnapshot(
      rxQuery,
      (snap) => {
        const list: Prescription[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<Prescription, 'id'>) }));
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setUserPrescriptions(list);
      },
      (error) => {
        console.warn('Error fetching user prescriptions:', error);
      }
    );

    return () => {
      unsubOrders();
      unsubRx();
    };
  }, [user]);

  // 3. Admin listeners (all orders & all prescriptions)
  useEffect(() => {
    if (!isAdmin) {
      setAllOrders([]);
      setAllPrescriptions([]);
      return;
    }

    const unsubAllOrders = onSnapshot(
      collection(db, 'orders'),
      (snap) => {
        const list: Order[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<Order, 'id'>) }));
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAllOrders(list);
      },
      (err) => console.warn('Admin orders error:', err)
    );

    const unsubAllRx = onSnapshot(
      collection(db, 'prescriptions'),
      (snap) => {
        const list: Prescription[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<Prescription, 'id'>) }));
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAllPrescriptions(list);
      },
      (err) => console.warn('Admin prescriptions error:', err)
    );

    return () => {
      unsubAllOrders();
      unsubAllRx();
    };
  }, [isAdmin]);

  // Derive categories
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  // Search & filter
  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.genericName.toLowerCase().includes(q) ||
      item.manufacturer.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // Create Order
  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<string> => {
    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const fullOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending',
    };

    try {
      await setDoc(doc(db, 'orders', orderId), fullOrder);
      return orderId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${orderId}`);
    }
  };

  // Submit Prescription
  const submitPrescription = async (data: Omit<Prescription, 'id' | 'createdAt' | 'status'>): Promise<string> => {
    const rxId = `RX-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const fullRx: Prescription = {
      ...data,
      id: rxId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'submitted',
    };

    try {
      await setDoc(doc(db, 'prescriptions', rxId), fullRx);
      return rxId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `prescriptions/${rxId}`);
    }
  };

  // Admin: Update order status
  const adminUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  // Admin: Update prescription status & notes
  const adminUpdatePrescription = async (prescriptionId: string, status: PrescriptionStatus, notes: string) => {
    try {
      await updateDoc(doc(db, 'prescriptions', prescriptionId), {
        status,
        pharmacistNotes: notes,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `prescriptions/${prescriptionId}`);
    }
  };

  // Admin: Save or update product
  const adminSaveProduct = async (product: Product) => {
    const id = product.id || `prod-${Date.now()}`;
    const payload = { ...product, id, updatedAt: new Date().toISOString() };
    try {
      await setDoc(doc(db, 'products', id), payload, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${id}`);
    }
  };

  // Admin: Delete product
  const adminDeleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
    }
  };

  // Admin: Update Shop Settings
  const adminUpdateShopSettings = async (settings: Partial<ShopSettings>) => {
    try {
      await setDoc(doc(db, 'shopSettings', 'current'), settings, { merge: true });
      setShopSettings((prev) => ({ ...prev, ...settings }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'shopSettings/current');
    }
  };

  // Admin: Seed Initial Inventory into Firestore
  const seedInitialInventory = async () => {
    try {
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod, { merge: true });
      }
      await setDoc(doc(db, 'shopSettings', 'current'), DEFAULT_SHOP_SETTINGS, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        shopSettings,
        loadingProducts,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        filteredProducts,
        createOrder,
        submitPrescription,
        userOrders,
        userPrescriptions,
        allOrders,
        allPrescriptions,
        adminUpdateOrderStatus,
        adminUpdatePrescription,
        adminSaveProduct,
        adminDeleteProduct,
        adminUpdateShopSettings,
        seedInitialInventory,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
