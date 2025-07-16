import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { TrendingUp, DollarSign, Clock, Star, CheckCircle } from 'lucide-react';

export function InvestmentPlans() {
  const { state, dispatch } = useApp();
  const { currentUser, investmentPlans } = state;
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');

  // Fallback plans if database fails
  const fallbackPlans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      minAmount: 2,
      maxAmount: 1000,
      hourlyRate: 0.089,
      duration: 336, // 2 weeks
      totalReturn: 30,
      featured: false,
    },
    {
      id: 'advanced',
      name: 'Advanced Plan',
      minAmount: 20,
      maxAmount: 5000,
      hourlyRate: 0.074,
      duration: 672, // 4 weeks
      totalReturn: 50,
      featured: true,
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      minAmount: 50,
      maxAmount: 10000,
      hourlyRate: 0.099,
      duration: 1008, // 6 weeks
      totalReturn: 100,
      featured: false,
    },
  ];

  const plansToShow = investmentPlans.length > 0 ? investmentPlans : fallbackPlans;

  const handleInvest = (planId: string) => {
    if (!currentUser) {
      alert('Please log in to invest');
      return;
    }

    const plan = plansToShow.find(p => p.id === planId);
    if (!plan) return;

    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount < plan.minAmount || amount > plan.maxAmount) {
      alert(`Please enter an amount between $${plan.minAmount} and $${plan.maxAmount}`);
      return;
    }

    if (amount > currentUser.balance) {
      alert('Insufficient balance');
      return;
    }

    // Create investment
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + plan.duration * 60 * 60 * 1000);

    const investment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      planId: plan.id,
      amount,
      startDate,
      endDate,
      hourlyRate: plan.hourlyRate,
      totalEarned: 0,
      isActive: true,
      lastPayout: startDate,
    };

    // Update user balance and totals
    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance - amount,
      totalInvested: currentUser.totalInvested + amount,
    };

    // Create transaction
    const transaction = {
      id: Date.now().toString(),
      userId: currentUser.id,
      type: 'investment' as const,
      amount,
      status: 'completed' as const,
      description: `Investment in ${plan.name}`,
      createdAt: new Date(),
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    dispatch({ type: 'ADD_INVESTMENT', payload: investment });
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });

    alert('Investment successful!');
    setSelectedPlan(null);
    setInvestmentAmount('');
  };

  const getDurationText = (hours: number) => {
    const weeks = Math.floor(hours / (24 * 7));
    return `${weeks} week${weeks > 1 ? 's' : ''}`;
  };

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Please Log In</h3>
        <p className="text-gray-600">You need to be logged in to view investment plans</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Investment Plans</h2>
        <p className="text-gray-600 mt-2">Choose the perfect plan for your investment goals</p>
      </div>

      {/* Investment Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plansToShow.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
              plan.featured 
                ? 'border-yellow-400 ring-2 ring-yellow-100' 
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            {plan.featured && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span>Most Popular</span>
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-indigo-600 mb-1">
                  {plan.totalReturn}%
                </div>
                <p className="text-sm text-gray-600">
                  Profit in {getDurationText(plan.duration)}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">
                    Minimum: ${plan.minAmount}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">
                    Maximum: ${plan.maxAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">
                    Duration: {getDurationText(plan.duration)}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">
                    Hourly Rate: {plan.hourlyRate.toFixed(3)}%
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  plan.featured
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                Invest Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Current Balance */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 mb-1">Available Balance</p>
            <p className="text-2xl font-bold">${currentUser.balance.toFixed(2)}</p>
          </div>
          <Wallet className="h-8 w-8 text-green-200" />
        </div>
      </div>

      {/* Investment Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            {(() => {
              const plan = plansToShow.find(p => p.id === selectedPlan);
              if (!plan) return null;

              return (
                <>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Invest in {plan.name}
                    </h3>
                    <p className="text-gray-600">
                      {plan.totalReturn}% profit in {getDurationText(plan.duration)}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Investment Amount
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          value={investmentAmount}
                          onChange={(e) => setInvestmentAmount(e.target.value)}
                          placeholder={`Min: $${plan.minAmount}, Max: $${plan.maxAmount}`}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Available balance: ${currentUser.balance.toFixed(2)}
                      </p>
                    </div>

                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h4 className="font-medium text-indigo-900 mb-2">Investment Summary</h4>
                      <div className="space-y-1 text-sm text-indigo-800">
                        <div className="flex justify-between">
                          <span>Investment:</span>
                          <span>${investmentAmount || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expected Profit:</span>
                          <span>
                            ${investmentAmount ? ((parseFloat(investmentAmount) * plan.totalReturn) / 100).toFixed(2) : '0.00'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>{getDurationText(plan.duration)}</span>
                        </div>
                        <div className="flex justify-between font-medium pt-2 border-t border-indigo-200">
                          <span>Total Return:</span>
                          <span>
                            ${investmentAmount ? (parseFloat(investmentAmount) + (parseFloat(investmentAmount) * plan.totalReturn) / 100).toFixed(2) : '0.00'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedPlan(null)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleInvest(selectedPlan)}
                        className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Confirm Investment
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}