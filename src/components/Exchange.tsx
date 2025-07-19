import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { X, CreditCard, DollarSign, Smartphone, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function Exchange() {
  const { state, dispatch } = useApp();
  const { currentUser } = state;
  const [activeAction, setActiveAction] = useState<'deposit' | 'withdraw' | null>(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('easypaisa');

  const handleDeposit = () => {
    if (!currentUser) return;

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (depositAmount < 1) {
      alert('Minimum deposit amount is $1');
      return;
    }

    // Update user balance
    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance + depositAmount,
    };

    // Create transaction
    const transaction = {
      id: Date.now().toString(),
      userId: currentUser.id,
      type: 'deposit' as const,
      amount: depositAmount,
      status: 'completed' as const,
      description: `Deposit via ${paymentMethod === 'easypaisa' ? 'Easypaisa' : paymentMethod === 'jazzcash' ? 'JazzCash' : 'Credit Card'}`,
      createdAt: new Date(),
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });

    alert(`✅ Deposit successful!\n\n💰 Amount: $${depositAmount.toFixed(2)}\n💳 Method: ${paymentMethod === 'easypaisa' ? 'Easypaisa' : paymentMethod === 'jazzcash' ? 'JazzCash' : 'Credit Card'}\n💵 New Balance: $${(currentUser.balance + depositAmount).toFixed(2)}`);
    setActiveAction(null);
    setAmount('');
  };

  const handleWithdraw = () => {
    if (!currentUser) return;

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (withdrawAmount < 10) {
      alert('Minimum withdrawal amount is $10');
      return;
    }

    if (withdrawAmount > currentUser.balance) {
      alert('Insufficient balance');
      return;
    }

    // Update user balance
    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance - withdrawAmount,
    };

    // Create transaction
    const transaction = {
      id: Date.now().toString(),
      userId: currentUser.id,
      type: 'withdrawal' as const,
      amount: withdrawAmount,
      status: 'pending' as const,
      description: `Withdrawal via ${paymentMethod === 'easypaisa' ? 'Easypaisa' : paymentMethod === 'jazzcash' ? 'JazzCash' : 'Bank Transfer'}`,
      createdAt: new Date(),
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });

    alert('Withdrawal request submitted! It will be processed within 24 hours.');
    setActiveAction(null);
    setAmount('');
  };

  const paymentMethods = [
    {
      id: 'easypaisa',
      name: 'Easypaisa',
      icon: Smartphone,
      description: 'Mobile wallet payment',
      color: 'bg-green-500',
      available: true,
    },
    {
      id: 'jazzcash',
      name: 'JazzCash',
      icon: Smartphone,
      description: 'Mobile wallet payment',
      color: 'bg-orange-500',
      available: true,
    },
    {
      id: 'credit-card',
      name: 'Credit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard',
      color: 'bg-blue-500',
      available: true,
    },
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      icon: DollarSign,
      description: 'Direct bank transfer',
      color: 'bg-purple-500',
      available: true,
    },
  ];

  if (!currentUser) return null;

  return (
    <div className="space-y-6 px-2 md:px-0">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Exchange</h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base">Deposit and withdraw funds securely</p>
      </div>

      {/* Balance Card - Mobile Optimized */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 md:p-6 text-white">
        <div className="text-center">
          <p className="text-indigo-100 mb-2 text-sm md:text-base">Available Balance</p>
          <p className="text-2xl md:text-3xl font-bold">${currentUser.balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Action Buttons - Mobile Optimized */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <button
          onClick={() => setActiveAction('deposit')}
          className="flex items-center justify-center space-x-2 md:space-x-3 p-4 md:p-6 bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-300 rounded-xl transition-all"
        >
          <ArrowDownRight className="h-5 w-5 md:h-6 md:w-6 text-green-600 flex-shrink-0" />
          <div className="text-left min-w-0">
            <p className="font-semibold text-green-700 text-sm md:text-base">Deposit</p>
            <p className="text-xs md:text-sm text-green-600">Add funds</p>
          </div>
        </button>

        <button
          onClick={() => setActiveAction('withdraw')}
          className="flex items-center justify-center space-x-2 md:space-x-3 p-4 md:p-6 bg-red-50 hover:bg-red-100 border-2 border-red-200 hover:border-red-300 rounded-xl transition-all"
        >
          <ArrowUpRight className="h-5 w-5 md:h-6 md:w-6 text-red-600 flex-shrink-0" />
          <div className="text-left min-w-0">
            <p className="font-semibold text-red-700 text-sm md:text-base">Withdraw</p>
            <p className="text-xs md:text-sm text-red-600">Cash out</p>
          </div>
        </button>
      </div>

      {/* Payment Methods - Mobile Optimized */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-3 md:p-4 border-2 rounded-xl transition-all ${
                method.available
                  ? 'border-gray-200 hover:border-indigo-300 cursor-pointer'
                  : 'border-gray-100 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 md:p-3 rounded-lg ${method.color} flex-shrink-0`}>
                  <method.icon className="h-4 w-4 md:h-6 md:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm md:text-base truncate">{method.name}</p>
                  <p className="text-xs md:text-sm text-gray-600 truncate">{method.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions - Mobile Optimized */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Exchange Activity</h3>
        <div className="space-y-3">
          {state.transactions
            .filter(t => t.userId === currentUser.id && (t.type === 'deposit' || t.type === 'withdrawal'))
            .slice(0, 5)
            .map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'deposit' ? (
                      <ArrowDownRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{transaction.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <span className={`text-sm font-medium ${
                    transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                  <p className={`text-xs ${
                    transaction.status === 'completed' 
                      ? 'text-green-600' 
                      : transaction.status === 'pending'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
          {state.transactions.filter(t => t.userId === currentUser.id && (t.type === 'deposit' || t.type === 'withdrawal')).length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No exchange activity yet</p>
          )}
        </div>
      </div>

      {/* Modal - Mobile Optimized */}
      {activeAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 md:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {activeAction === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
              </h3>
              <button
                onClick={() => setActiveAction(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className={`p-3 md:p-4 rounded-lg ${
                activeAction === 'deposit' ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="flex items-start space-x-2">
                  <AlertCircle className={`h-4 w-4 md:h-5 md:w-5 mt-0.5 flex-shrink-0 ${
                    activeAction === 'deposit' ? 'text-green-600' : 'text-yellow-600'
                  }`} />
                  <p className={`text-sm ${
                    activeAction === 'deposit' ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    {activeAction === 'deposit' 
                      ? 'Minimum deposit amount is $1. Funds will be available immediately.'
                      : 'Minimum withdrawal amount is $10. Processing time: 24 hours.'
                    }
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                  />
                </div>
                {activeAction === 'withdraw' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Available balance: ${currentUser.balance.toFixed(2)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3 flex-shrink-0"
                      />
                      <method.icon className="h-4 w-4 md:h-5 md:w-5 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={`rounded-lg p-4 ${
                activeAction === 'deposit' ? 'bg-blue-50' : 'bg-red-50'
              }`}>
                <h4 className={`font-medium mb-2 ${
                  activeAction === 'deposit' ? 'text-blue-900' : 'text-red-900'
                }`}>
                  {activeAction === 'deposit' ? 'Deposit' : 'Withdrawal'} Summary
                </h4>
                <div className={`space-y-1 text-sm ${
                  activeAction === 'deposit' ? 'text-blue-800' : 'text-red-800'
                }`}>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>${amount || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee:</span>
                    <span>$0.00</span>
                  </div>
                  <div className={`flex justify-between font-medium pt-2 border-t ${
                    activeAction === 'deposit' ? 'border-blue-200' : 'border-red-200'
                  }`}>
                    <span>Total:</span>
                    <span>${amount || '0.00'}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setActiveAction(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={activeAction === 'deposit' ? handleDeposit : handleWithdraw}
                  className={`flex-1 px-4 py-3 text-white rounded-lg transition-colors text-sm md:text-base ${
                    activeAction === 'deposit'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {activeAction === 'deposit' ? 'Deposit' : 'Withdraw'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}