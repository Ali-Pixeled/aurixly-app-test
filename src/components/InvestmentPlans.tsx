import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { InvestmentPlan } from '../types';
import { Star, TrendingUp, Clock, DollarSign } from 'lucide-react';

export function InvestmentPlans() {
  const { state, dispatch } = useApp();
  const { investmentPlans, currentUser } = state;
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');

  const handleInvest = (plan: InvestmentPlan) => {
    if (!currentUser) return;
    
    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount < plan.minAmount || amount > plan.maxAmount) {
      alert(`Investment amount must be between $${plan.minAmount} and $${plan.maxAmount}`);
      return;
    }
    
    if (amount > currentUser.balance) {
      alert('Insufficient balance');
      return;
    }

    // Create investment
    const newInvestment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      planId: plan.id,
      amount,
      startDate: new Date(),
      endDate: new Date(Date.now() + plan.duration * 60 * 60 * 1000),
      hourlyRate: plan.hourlyRate,
      totalEarned: 0,
      isActive: true,
      lastPayout: new Date(),
    };

    // Update user balance
    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance - amount,
      totalInvested: currentUser.totalInvested + amount,
    };

    // Create transaction
    const transaction = {
      id: Date.now().toString() + '_tx',
      userId: currentUser.id,
      type: 'investment' as const,
      amount,
      status: 'completed' as const,
      description: `Investment in ${plan.name}`,
      createdAt: new Date(),
    };

    dispatch({ type: 'ADD_INVESTMENT', payload: newInvestment });
    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });

    setSelectedPlan(null);
    setInvestmentAmount('');
    alert('Investment successful!');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Investment Plans</h2>
        <p className="text-gray-600 mt-2">Choose a plan that suits your investment goals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investmentPlans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${
              plan.featured ? 'ring-2 ring-yellow-400' : ''
            }`}
          >
            {plan.featured && (
              <div className="bg-yellow-400 text-yellow-900 text-center py-2 px-4">
                <div className="flex items-center justify-center space-x-1">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">Most Popular</span>
                </div>
              </div>
            )}
            
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-indigo-600 mb-1">
                  {plan.hourlyRate}%
                </div>
                <p className="text-sm text-gray-600">per hour</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Min Amount</span>
                  </div>
                  <span className="text-sm font-medium">${plan.minAmount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Max Amount</span>
                  </div>
                  <span className="text-sm font-medium">${plan.maxAmount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Duration</span>
                  </div>
                  <span className="text-sm font-medium">{Math.floor(plan.duration / 24)} days</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Total Return</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">{plan.totalReturn}%</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPlan(plan)}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Invest Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Investment Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Invest in {selectedPlan.name}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Amount
                </label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder={`Min: $${selectedPlan.minAmount}, Max: $${selectedPlan.maxAmount}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Investment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Hourly Rate:</span>
                    <span>{selectedPlan.hourlyRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{Math.floor(selectedPlan.duration / 24)} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Return:</span>
                    <span className="text-green-600">{selectedPlan.totalReturn}%</span>
                  </div>
                  {investmentAmount && (
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Expected Profit:</span>
                      <span className="text-green-600">
                        ${(parseFloat(investmentAmount) * (selectedPlan.totalReturn / 100)).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleInvest(selectedPlan)}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Confirm Investment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}