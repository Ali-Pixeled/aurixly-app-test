import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { TrendingUp, DollarSign, Clock, Star, CheckCircle, Wallet, AlertCircle, X } from 'lucide-react';

export function InvestmentPlans() {
  const { state, dispatch } = useApp();
  const { currentUser, investmentPlans } = state;
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);

  // Optimized fallback plans with your specifications
  const fallbackPlans = useMemo(() => [
    {
      id: 'starter',
      name: 'Starter Plan',
      minAmount: 2,
      maxAmount: 1000,
      hourlyRate: 0.089, // 30% over 2 weeks
      duration: 336, // 2 weeks in hours
      totalReturn: 30,
      featured: false,
      description: 'Perfect for beginners',
      color: 'from-blue-500 to-blue-600',
      icon: '🚀'
    },
    {
      id: 'advanced',
      name: 'Advanced Plan',
      minAmount: 20,
      maxAmount: 5000,
      hourlyRate: 0.074, // 50% over 4 weeks
      duration: 672, // 4 weeks in hours
      totalReturn: 50,
      featured: true,
      description: 'Most popular choice',
      color: 'from-green-500 to-green-600',
      icon: '💎'
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      minAmount: 50,
      maxAmount: 10000,
      hourlyRate: 0.099, // 100% over 6 weeks
      duration: 1008, // 6 weeks in hours
      totalReturn: 100,
      featured: false,
      description: 'Maximum returns',
      color: 'from-purple-500 to-purple-600',
      icon: '👑'
    },
  ], []);

  const plansToShow = useMemo(() => {
    return investmentPlans.length > 0 ? investmentPlans : fallbackPlans;
  }, [investmentPlans, fallbackPlans]);

  const handleInvest = async (planId: string) => {
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
      alert('Insufficient balance. Please deposit funds first.');
      return;
    }

    setIsInvesting(true);

    try {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

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
        id: (Date.now() + 1).toString(),
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

      alert('🎉 Investment successful! Your earnings will start accumulating immediately.');
      setSelectedPlan(null);
      setInvestmentAmount('');
    } catch (error) {
      console.error('Investment error:', error);
      alert('Investment failed. Please try again.');
    } finally {
      setIsInvesting(false);
    }
  };

  const getDurationText = (hours: number) => {
    const weeks = Math.floor(hours / (24 * 7));
    return `${weeks} week${weeks > 1 ? 's' : ''}`;
  };

  const calculateProfit = (amount: string, returnRate: number) => {
    const amt = parseFloat(amount) || 0;
    return (amt * returnRate / 100).toFixed(2);
  };

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center animate-fade-in max-w-sm">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Please Log In</h3>
          <p className="text-gray-600 text-sm">You need to be logged in to view investment plans</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section - Mobile Optimized */}
      <div className="text-center px-2">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full px-3 py-2 mb-4">
          <TrendingUp className="h-4 w-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-800">Investment Opportunities</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Choose Your Investment Plan</h2>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Start your journey to financial freedom with our carefully designed investment plans. 
          Each plan offers guaranteed returns with transparent terms.
        </p>
      </div>

      {/* Balance Card - Mobile Optimized */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300 mx-2 md:mx-0">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-green-100 mb-1 text-sm">Available Balance</p>
            <p className="text-2xl md:text-3xl font-bold truncate">${currentUser.balance.toFixed(2)}</p>
            <p className="text-green-100 text-sm mt-1">Ready to invest</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-full p-3 md:p-4 flex-shrink-0 ml-4">
            <Wallet className="h-6 w-6 md:h-8 md:w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Investment Plans Grid - Mobile Optimized */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-2 md:px-0">
        {plansToShow.map((plan, index) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-xl md:rounded-2xl shadow-lg border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 md:hover:-translate-y-2 ${
              plan.featured 
                ? 'border-yellow-400 ring-2 md:ring-4 ring-yellow-100 scale-102 md:scale-105' 
                : 'border-gray-200 hover:border-indigo-300'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {plan.featured && (
              <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 px-3 md:px-6 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold flex items-center space-x-1 md:space-x-2 shadow-lg">
                  <Star className="h-3 w-3 md:h-4 md:w-4" />
                  <span>Most Popular</span>
                </div>
              </div>
            )}

            <div className="p-4 md:p-8">
              {/* Plan Header - Mobile Optimized */}
              <div className="text-center mb-6 md:mb-8">
                <div className="text-3xl md:text-4xl mb-2 md:mb-3">{plan.icon || '💰'}</div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-3 md:mb-4">{plan.description || 'Great investment option'}</p>
                <div className={`bg-gradient-to-r ${plan.color || 'from-indigo-500 to-purple-600'} text-white rounded-lg md:rounded-xl p-3 md:p-4 mb-3 md:mb-4`}>
                  <div className="text-3xl md:text-4xl font-bold mb-1">
                    {plan.totalReturn}%
                  </div>
                  <p className="text-sm opacity-90">
                    Profit in {getDurationText(plan.duration)}
                  </p>
                </div>
              </div>

              {/* Plan Features - Mobile Optimized */}
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <div className="flex items-center space-x-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-gray-900 block">Minimum Investment</span>
                    <p className="text-xs text-gray-600">${plan.minAmount}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-gray-900 block">Maximum Investment</span>
                    <p className="text-xs text-gray-600">${plan.maxAmount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-blue-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-gray-900 block">Duration</span>
                    <p className="text-xs text-gray-600">{getDurationText(plan.duration)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-purple-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-gray-900 block">Hourly Rate</span>
                    <p className="text-xs text-gray-600">{plan.hourlyRate.toFixed(3)}%</p>
                  </div>
                </div>
              </div>

              {/* CTA Button - Mobile Optimized */}
              <button
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full py-3 md:py-4 px-4 md:px-6 rounded-lg md:rounded-xl font-semibold text-base md:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  plan.featured
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-yellow-900 shadow-lg'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg'
                }`}
              >
                Invest Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Investment Modal - Mobile Optimized */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl transform animate-scale-in">
            {(() => {
              const plan = plansToShow.find(p => p.id === selectedPlan);
              if (!plan) return null;

              return (
                <>
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="text-center flex-1">
                      <div className="text-3xl md:text-4xl mb-2 md:mb-4">{plan.icon || '💰'}</div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
                        Invest in {plan.name}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base">
                        {plan.totalReturn}% profit in {getDurationText(plan.duration)}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedPlan(null)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 md:mb-3">
                        Investment Amount
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 md:left-4 top-3 md:top-4 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          value={investmentAmount}
                          onChange={(e) => setInvestmentAmount(e.target.value)}
                          placeholder={`Min: $${plan.minAmount}, Max: $${plan.maxAmount}`}
                          className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base md:text-lg transition-all duration-300"
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-sm">
                        <span className="text-gray-500 truncate">
                          Available: ${currentUser.balance.toFixed(2)}
                        </span>
                        <span className="text-indigo-600 truncate">
                          Range: ${plan.minAmount} - ${plan.maxAmount}
                        </span>
                      </div>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      {[plan.minAmount, Math.min(100, plan.maxAmount), Math.min(500, plan.maxAmount)].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setInvestmentAmount(amount.toString())}
                          className="py-2 px-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors truncate"
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>

                    {/* Investment Summary */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-indigo-200">
                      <h4 className="font-semibold text-indigo-900 mb-3 md:mb-4 flex items-center text-sm md:text-base">
                        <TrendingUp className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                        Investment Summary
                      </h4>
                      <div className="space-y-2 md:space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-indigo-800">Investment:</span>
                          <span className="font-medium">${investmentAmount || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-indigo-800">Expected Profit:</span>
                          <span className="font-medium text-green-600">
                            +${calculateProfit(investmentAmount, plan.totalReturn)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-indigo-800">Duration:</span>
                          <span className="font-medium">{getDurationText(plan.duration)}</span>
                        </div>
                        <div className="border-t border-indigo-200 pt-2 md:pt-3">
                          <div className="flex justify-between">
                            <span className="text-indigo-900 font-semibold">Total Return:</span>
                            <span className="font-bold text-base md:text-lg text-green-600">
                              ${investmentAmount ? (parseFloat(investmentAmount) + parseFloat(calculateProfit(investmentAmount, plan.totalReturn))).toFixed(2) : '0.00'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Warning for insufficient balance */}
                    {parseFloat(investmentAmount) > currentUser.balance && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-red-600 flex-shrink-0" />
                          <p className="text-sm text-red-800">
                            Insufficient balance. Please deposit funds first.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3 md:space-x-4">
                      <button
                        onClick={() => setSelectedPlan(null)}
                        disabled={isInvesting}
                        className="flex-1 px-4 md:px-6 py-3 md:py-4 border-2 border-gray-300 rounded-lg md:rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 text-sm md:text-base"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleInvest(selectedPlan)}
                        disabled={isInvesting || !investmentAmount || parseFloat(investmentAmount) > currentUser.balance}
                        className="flex-1 px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg md:rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm md:text-base"
                      >
                        {isInvesting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          'Confirm Investment'
                        )}
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