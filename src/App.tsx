/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { LoanHistoryView } from './views/LoanHistoryView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { CustomerDashboardView } from './views/CustomerDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab]);

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <HomeView setCurrentTab={setCurrentTab} />;
      case 'stories':
        return <LoanHistoryView setCurrentTab={setCurrentTab} />;
      case 'about':
        return <AboutView setCurrentTab={setCurrentTab} />;
      case 'contact':
        return <ContactView />;
      case 'customer-dashboard':
        return <CustomerDashboardView />;
      case 'admin-dashboard':
        return <AdminDashboardView />;
      default:
        return <HomeView setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen font-sans bg-slate-50/30 selection:bg-teal-500/10 selection:text-teal-900" id="app-root-shell">
        <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        
        <main className="flex-grow">
          {renderContent()}
        </main>
        
        <Footer setCurrentTab={setCurrentTab} />
      </div>
    </AppProvider>
  );
}

