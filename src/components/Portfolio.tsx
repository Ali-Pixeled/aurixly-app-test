import React from 'react';
import { useApp } from '../contexts/AppContext';
import { TrendingUp, Clock, DollarSign } from 'lucide-react';

export function Portfolio() {
  const { state } = useApp();
  const { currentUser, investments, investmentPlans } = state;

  if (!currentUser) return null;

  const userInvestments = investments.filter(inv => inv.userId === currentUser.id);
  const activeInvestments = userInvestments.filter(inv => inv.isActive);
  const completedInvestments = userInvestments.filter(inv => !inv.isActive);

  const getTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Completed';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h`;
  };

  const getProgress = (startDate: Date, endDate: Date) => {
    const now = new Date();
    const total = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Portfolio</h2>
        <p className="text-gray-600 mt-2">Track your investments and earnings</p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Active Investments</p>
              <p className="text-2xl font-bold">{activeInvestments.length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Invested</p>
              <p className="text-2xl font-bold">${currentUser.totalInvested.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Total Earned</p>
              <p className="text-2xl font-bold">
                ${userInvestments.reduce((sum, inv) => sum + inv.totalEarned, 0).toFixed(2)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-200" />
          </div>
        </div>
      </div>

      {/* Active Investments */}
      {activeInvestments.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Investments</h3>
          <div className="space-y-4">
            {activeInvestments.map((investment) => {
              const plan = investmentPlans.find(p => p.id === investment.planId);
              const progress = getProgress(investment.startDate, investment.endDate);
              
              return (
                <div key={investment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{plan?.name}</h4>
                      <p className="text-sm text-gray-600">
                        Started: {investment.startDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ${investment.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-green-600">
                        +${investment.totalEarned.toFixed(2)} earned
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-600">Rate: {plan?.hourlyRate}%/hour</span>
                      <span className="text-gray-600">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {getTimeRemaining(investment.endDate)}
                      </span>
                    </div>
                    <span className="text-green-600 font-medium">
                      Expected: ${(investment.amount * (plan?.totalReturn || 0) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Investments */}
      {completedInvestments.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed Investments</h3>
          <div className="space-y-4">
            {completedInvestments.map((investment) => {
              const plan = investmentPlans.find(p => p.id === investment.planId);
              
              return (
                <div key={investment.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{plan?.name}</h4>
                      <p className="text-sm text-gray-600">
                        {investment.startDate.toLocaleDateString()} - {investment.endDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ${investment.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-green-600">
                        +${investment.totalEarned.toFixed(2)} earned
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {userInvestments.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Investments Yet</h3>
          <p className="text-gray-600">Start investing to build your portfolio</p>
        </div>
      )}
    </div>
  );
}