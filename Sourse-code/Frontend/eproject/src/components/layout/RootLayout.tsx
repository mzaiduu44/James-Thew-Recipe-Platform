import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ToastContainer } from '../ui/ToastContainer';
import { ErrorBoundary } from './ErrorBoundary';
import { ThemeTransitionCurtain } from './ThemeTransitionCurtain';
import { ScrollToTop } from '../shared/ScrollToTop';

export const RootLayout: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] selection:bg-[var(--color-primary)] selection:text-[var(--color-on-primary)] font-sans antialiased">
        <ThemeTransitionCurtain />
        <ToastContainer />

        {!isAdminRoute && <Navbar />}

        <main className="flex-1 pb-20 lg:pb-0">
          <Outlet />
        </main>

        {!isAdminRoute && <Footer />}
      </div>
    </ErrorBoundary>
  );
};
