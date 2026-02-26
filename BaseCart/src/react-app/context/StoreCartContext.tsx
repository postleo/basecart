import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
}

interface StoreCartContextType {
  items: CartItem[];
  businessSlug: string | null;
  addItem: (item: Omit<CartItem, 'quantity'>, slug: string) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const StoreCartContext = createContext<StoreCartContextType | undefined>(undefined);

export function StoreCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [businessSlug, setBusinessSlug] = useState<string | null>(null);

  const addItem = (item: Omit<CartItem, 'quantity'>, slug: string) => {
    // If switching to a different store, clear cart
    if (businessSlug && businessSlug !== slug) {
      setItems([{ ...item, quantity: 1 }]);
      setBusinessSlug(slug);
      return;
    }
    
    setBusinessSlug(slug);
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    }
  };

  const clearCart = () => {
    setItems([]);
    setBusinessSlug(null);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreCartContext.Provider value={{ items, businessSlug, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </StoreCartContext.Provider>
  );
}

export function useStoreCart() {
  const context = useContext(StoreCartContext);
  if (!context) {
    throw new Error('useStoreCart must be used within a StoreCartProvider');
  }
  return context;
}
