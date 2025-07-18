import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { InvestmentPlans } from './InvestmentPlans';
import { Portfolio } from './Portfolio';
import { TransactionHistory } from './TransactionHistory';
import { AdminPanel } from './AdminPanel';
import { Exchange } from './Exchange';
import { Profile } from './Profile';
import { 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  PiggyBank, 
  Plus,
  Minus,
  BarChart3,
  Users,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUpDown
} from 'lucide-react';

interface DashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Dashboard({ activeTab = 'home', onTabChange }: DashboardProps) {
  const { state } = useApp();
  const { currentUser, investments } = state;

  if (!currentUser) return null;

  const userInvestments = investments.filter(inv => inv.userId === currentUser.id);
  const activeInvestments = userInvestments.filter(inv => inv.isActive);
  const totalProfits = userInvestments.reduce((sum, inv) => sum + (inv.totalEarned || 0), 0);

  const stats = [
    {
      title: 'Current Balance',
      value: `$${currentUser.balance.toFixed(2)}`,
      icon: Wallet,
      color: 'bg-green-500',
      change: '+2.5%',
      changeType: 'positive'
    },
    {
      title: 'Total Invested',
      value: `$${currentUser.totalInvested.toFixed(2)}`,
      icon: PiggyBank,
      color: 'bg-blue-500',
      change: '+12.3%',
      changeType: 'positive'
    },
    {
      title: 'Total Earned',
      value: `$${(totalProfits || 0).toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      change: '+8.7%',
      changeType: 'positive'
    },
    {
      title: 'Active Investments',
      value: activeInvestments.length.toString(),
      icon: DollarSign,
      color: 'bg-purple-500',
      change: activeInvestments.length > 0 ? 'Active' : 'None',
      changeType: activeInvestments.length > 0 ? 'neutral' : 'negative'
    },
  ];

  const renderHomeContent = () => (
    <div className="space-y-6 md:space-y-8 animate-fade-in px-2 md:px-0">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl md:rounded-2xl p-4 md:p-8 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl md:text-3xl">👋</span>
              <h1 className="text-xl md:text-3xl font-bold truncate">Welcome back, {currentUser.name}!</h1>
            </div>
            <p className="text-indigo-100 text-sm md:text-lg">Track your investments and grow your wealth</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs md:text-sm">
              <div className="bg-white bg-opacity-20 rounded-full px-2 md:px-3 py-1">
                <span>🚀 Growing Portfolio</span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full px-2 md:px-3 py-1">
                <span>💎 Premium Member</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:block flex-shrink-0 ml-4">
            <div className="bg-white bg-opacity-20 rounded-full p-3 md:p-4 animate-pulse-glow">
              <TrendingUp className="h-8 w-8 md:h-12 md:w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, index) => (
          <div 
            key={stat.title} 
            className="bg-white rounded-xl md:rounded-2xl shadow-lg p-3 md:p-6 border border-gray-100 transform hover:scale-105 hover:shadow-xl transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${stat.color} shadow-lg flex-shrink-0`}>
                <stat.icon className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
              <span className={`text-xs font-bold px-2 md:px-3 py-1 rounded-full ${
                stat.changeType === 'positive' 
                  ? 'bg-green-100 text-green-800'
                  : stat.changeType === 'negative'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2 truncate">{stat.title}</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900 truncate">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8 border border-gray-100">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
          <span className="mr-2">⚡</span>
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          <button
            onClick={() => onTabChange?.('exchange')}
            className="flex flex-col items-center space-y-2 md:space-y-3 p-3 md:p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
          >
            <div className="bg-green-500 rounded-full p-2 md:p-3">
              <Plus className="h-4 w-4 md:h-6 md:w-6 text-white" />
            </div>
            <span className="text-xs md:text-sm font-bold text-green-700">Deposit</span>
          </button>
          <button
            onClick={() => onTabChange?.('exchange')}
            className="flex flex-col items-center space-y-2 md:space-y-3 p-3 md:p-6 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
          >
            <div className="bg-red-500 rounded-full p-2 md:p-3">
              <Minus className="h-4 w-4 md:h-6 md:w-6 text-white" />
            </div>
            <span className="text-xs md:text-sm font-bold text-red-700">Withdraw</span>
          </button>
          <button
            onClick={() => onTabChange?.('invest')}
            className="flex flex-col items-center space-y-2 md:space-y-3 p-3 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
          >
            <div className="bg-blue-500 rounded-full p-2 md:p-3">
              <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-white" />
            </div>
            <span className="text-xs md:text-sm font-bold text-blue-700">Invest</span>
          </button>
          <button
            onClick={() => onTabChange?.('transactions')}
            className="flex flex-col items-center space-y-2 md:space-y-3 p-3 md:p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
          >
            <div className="bg-purple-500 rounded-full p-2 md:p-3">
              <Eye className="h-4 w-4 md:h-6 md:w-6 text-white" />
            </div>
            <span className="text-xs md:text-sm font-bold text-purple-700">History</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 animate-slide-up">
          <h4 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
            <span className="mr-2">📊</span>
            Recent Transactions
          </h4>
          <div className="space-y-3">
            {state.transactions
              .filter(t => t.userId === currentUser.id)
              .slice(0, 3)
              .map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 md:py-3 px-3 md:px-4 bg-gray-50 rounded-lg md:rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                    <div className={`p-1.5 md:p-2 rounded-full flex-shrink-0 ${
                      transaction.type === 'deposit' || transaction.type === 'profit' 
                        ? 'bg-green-500' 
                        : 'bg-red-500'
                    }`}>
                      {transaction.type === 'deposit' || transaction.type === 'profit' ? (
                        <ArrowDownRight className="h-3 w-3 md:h-4 md:w-4 text-white" />
                        +${(investment.currentProfit || 0).toFixed(2)}
                        <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 text-white" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-gray-900 truncate">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{transaction.createdAt.toLocaleDateString()}</p>
                        ${(investment.amount || 0).toFixed(2)} invested
                  </div>
                  <span className={`text-xs md:text-sm font-bold flex-shrink-0 ml-2 ${
                    transaction.type === 'deposit' || transaction.type === 'profit' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.type === 'deposit' || transaction.type === 'profit' ? '+' : '-'}
                    ${transaction.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            {state.transactions.filter(t => t.userId === currentUser.id).length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">💳</div>
                <p className="text-sm text-gray-500">No transactions yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h4 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
            <span className="mr-2">💰</span>
            Active Investments
          </h4>
          <div className="space-y-3">
            {activeInvestments.slice(0, 3).map((investment) => {
              const plan = state.investmentPlans.find(p => p.id === investment.planId);
              return (
                <div key={investment.id} className="flex items-center justify-between py-2 md:py-3 px-3 md:px-4 bg-gray-50 rounded-lg md:rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm font-medium text-gray-900 truncate">{plan?.name}</p>
                    <p className="text-xs text-gray-500">
                      ${investment.amount.toFixed(2)} invested
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="text-xs md:text-sm font-bold text-green-600 animate-pulse">
                      +${investment.currentProfit.toFixed(2)}
                    </span>
                    <p className="text-xs text-gray-500">Live</p>
                  </div>
                </div>
              );
            })}
            {activeInvestments.length === 0 && (
              <div className="text-center py-8">
                <div className="text-3xl md:text-4xl mb-2">📈</div>
                <p className="text-sm text-gray-500">No active investments</p>
                <button
                  onClick={() => onTabChange?.('invest')}
                  className="mt-3 text-xs md:text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Start investing →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'invest':
        return <InvestmentPlans />;
      case 'exchange':
        return <Exchange />;
      case 'transactions':
        return <TransactionHistory />;
      case 'profile':
        return <Profile />;
      case 'portfolio':
        return <Portfolio />;
      case 'admin':
        return currentUser.isAdmin ? <AdminPanel /> : renderHomeContent();
      default:
        return renderHomeContent();
    }
  };

  return (
    <div className="space-y-6">
      {/* Desktop Navigation Tabs */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'home', label: 'Overview', icon: BarChart3 },
              { id: 'invest', label: 'Invest', icon: TrendingUp },
              { id: 'exchange', label: 'Exchange', icon: ArrowUpDown },
              { id: 'portfolio', label: 'Portfolio', icon: PiggyBank },
              { id: 'transactions', label: 'History', icon: DollarSign },
              ...(currentUser.isAdmin ? [{ id: 'admin', label: 'Admin', icon: Users }] : []),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}