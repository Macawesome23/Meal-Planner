import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import StoreProvider from '@/store/StoreProvider';
import Header from '@/components/Header';

import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Culina - Smart Meal Planner',
  description: 'Your intelligent kitchen assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FDFBF7] font-sans antialiased selection:bg-orange-200">
        <StoreProvider>
          <Header />
          <div className="pt-20">
            {children}
          </div>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1f2937', // gray-800
                color: '#fff',
                borderRadius: '16px',
                fontWeight: '600',
                padding: '16px 20px',
              },
              success: {
                iconTheme: {
                  primary: '#f97316', // orange-500
                  secondary: '#fff',
                },
              },
            }}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
