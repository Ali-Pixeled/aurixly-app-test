import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { X, DollarSign, AlertCircle } from 'lucide-react';

interface WithdrawModalProps {
  onClose: () => void;
}

export function WithdrawModal({ onClose }: WithdrawModalProps) {
  const { state, dispatch } = useApp();
  const { currentUser } = state;
  const [amount, setAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank-transfer');

  const handleWithdraw = () => {
    if (!currentUser) return;

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      alert('Please enter a valid amount');
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
      description: `Withdrawal via ${withdrawMethod}`,
      createdAt: new Date(),
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });

    alert('Withdrawal request submitted! It will be processed within 24 hours.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Withdraw Funds</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Withdrawals are processed within 24 hours. Minimum withdrawal amount is $10.
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
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Available balance: ${currentUser?.balance.toFixed(2) || '0.00'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="bank-transfer"
                  checked={withdrawMethod === 'bank-transfer'}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="mr-3"
                />
                <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm">Bank Transfer</span>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="paypal"
                  checked={withdrawMethod === 'paypal'}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="mr-3"
                />
                <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm">PayPal</span>
              </label>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-2">Withdrawal Summary</h4>
            <div className="space-y-1 text-sm text-red-800">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>${amount || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Fee:</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-red-200">
                <span>Total:</span>
                <span>${amount || '0.00'}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleWithdraw}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}