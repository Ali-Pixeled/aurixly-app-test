import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import { useApp } from '../contexts/AppContext';
import { TrendingUp, Home, ArrowUpDown, History, UserCircle, Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Layout({ children, activeTab = 'home', onTabChange }: LayoutProps) {
  const { state } = useApp();
  const { currentUser } = state;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {children}
      </div>
    );
  }

  const bottomNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'invest', label: 'Invest', icon: TrendingUp },
    { id: 'exchange', label: 'Exchange', icon: ArrowUpDown },
    { id: 'transactions', label: 'History', icon: History },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Desktop Header */}
      <nav className="hidden md:block bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-2">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Aurixly</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">BETA</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{currentUser.name}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                  <span className="text-sm text-gray-500">Balance:</span>
                  <span className="text-sm font-semibold text-green-600">
                    ${currentUser.balance.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-full">
                  <span className="text-sm text-gray-500">Profits:</span>
                  <span className="text-sm font-semibold text-yellow-600">
                    ${(currentUser.profitBalance || 0).toFixed(2)}
                  </span>
                </div>
              </div>
              
              {currentUser.isAdmin && (
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                    Admin
                  </span>
                </div>
              )}
              
              <UserButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <nav className="md:hidden bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="px-3 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-1.5">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Aurixly</span>
              <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full font-medium">BETA</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-xs text-gray-500">Balance</div>
                <div className="text-sm font-semibold text-green-600">
                  ${currentUser.balance.toFixed(2)}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xs text-gray-500">Profits</div>
                <div className="text-sm font-semibold text-yellow-600">
                  ${(currentUser.profitBalance || 0).toFixed(2)}
                </div>
              </div>
              
              {currentUser.isAdmin && (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                  Admin
                </span>
              )}
              
              <UserButton />
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content with proper spacing for fixed bottom nav */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="pb-20 md:pb-0">
          {children}
        </div>
      </main>

      {/* Fixed Bottom Navigation - Mobile Only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="grid grid-cols-5 h-16">
          {bottomNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                activeTab === item.id
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}