import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@getmocha/users-service/react';

interface Business {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  custom_link_url: string | null;
  custom_link_text: string | null;
  owner_user_id: string;
  created_at: string;
  updated_at: string;
}

interface BusinessContextType {
  business: Business | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const { user, isPending } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBusiness = async () => {
    if (!user) {
      setBusiness(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/business/me');
      if (res.ok) {
        const data = await res.json();
        setBusiness(data.business);
      }
    } catch (error) {
      console.error('Failed to fetch business:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isPending) {
      fetchBusiness();
    }
  }, [user, isPending]);

  return (
    <BusinessContext.Provider value={{ business, isLoading: isLoading || isPending, refetch: fetchBusiness }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
