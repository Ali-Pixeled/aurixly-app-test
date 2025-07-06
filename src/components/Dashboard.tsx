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
  const totalProfits = userInvestments.reduce((sum, inv) => sum + inv.totalEarned, 0);

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
      value: `$${totalProfits.toFixed(2)}`,
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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {currentUser.name}!</h1>
            <p className="text-indigo-100">Track your investments and grow your wealth</p>
          </div>
          <div className="hidden sm:block">
            <TrendingUp className="h-12 w-12 text-indigo-200" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 lg:p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
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
              <p className="text-xs lg:text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onTabChange?.('exchange')}
            className="flex flex-col items-center space-y-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <Plus className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium text-green-700">Deposit</span>
          </button>
          <button
            onClick={() => onTabChange?.('exchange')}
            className="flex flex-col items-center space-y-2 p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Minus className="h-6 w-6 text-red-600" />
            <span className="text-sm font-medium text-red-700">Withdraw</span>
          </button>
          <button
            onClick={() => onTabChange?.('invest')}
            className="flex flex-col items-center space-y-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Invest</span>
          </button>
          <button
            onClick={() => onTabChange?.('transactions')}
            className="flex flex-col items-center space-y-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <Eye className="h-6 w-6 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">History</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h4>
          <div className="space-y-3">
            {state.transactions
              .filter(t => t.userId === currentUser.id)
              .slice(0, 3)
              .map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'deposit' || transaction.type === 'profit' 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}>
                      {transaction.type === 'deposit' || transaction.type === 'profit' ? (
                        <ArrowDownRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{transaction.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${
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
              <p className="text-sm text-gray-500 text-center py-4">No transactions yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Active Investments</h4>
          <div className="space-y-3">
            {activeInvestments.slice(0, 3).map((investment) => {
              const plan = state.investmentPlans.find(p => p.id === investment.planId);
              return (
                <div key={investment.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{plan?.name}</p>
                    <p className="text-xs text-gray-500">${investment.amount.toFixed(2)} invested</p>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    +${investment.totalEarned.toFixed(2)}
                  </span>
                </div>
              );
            })}
            {activeInvestments.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No active investments</p>
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