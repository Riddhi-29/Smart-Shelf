import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from './components/Layout/Sidebar';
import InventoryTable from './components/Inventory/InventoryTable';
import AlertPanel from './components/Alerts/AlertPanel';
import InvoiceParser from './components/InvoiceParser/InvoiceParser';
import FlashSalePanel from './components/FlashSale/FlashSalePanel';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1,
    },
  },
});

function AppContent() {
  const [activeTab, setActiveTab] = useState('inventory');

  const getTitle = () => {
    switch (activeTab) {
      case 'inventory':
        return 'Inventory Management';
      case 'alerts':
        return 'Alerts & Notifications';
      case 'invoice':
        return 'AI Invoice Parser';
      case 'flash-sale':
        return 'Flash Sale Suggestions';
      default:
        return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'inventory':
        return <InventoryTable />;
      case 'alerts':
        return <AlertPanel />;
      case 'invoice':
        return <InvoiceParser />;
      case 'flash-sale':
        return <FlashSalePanel />;
      default:
        return <InventoryTable />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 p-4 lg:p-8 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          <header className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {getTitle()}
            </h1>
          </header>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
