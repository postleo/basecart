import { ReactNode } from 'react';
import OrderHeader from './OrderHeader';

interface OrderLayoutProps {
  children: ReactNode;
}

export default function OrderLayout({ children }: OrderLayoutProps) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <OrderHeader />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '30px 20px' }}>
        {children}
      </main>
    </div>
  );
}
