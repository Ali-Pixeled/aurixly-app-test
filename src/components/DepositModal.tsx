import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { X, CreditCard, DollarSign } from 'lucide-react';

interface DepositModalProps {
  onClose: () => void;
}

export function DepositModal({ onClose }: DepositModalProps) {
  const { state, dispatch } = useApp();
  const { currentUser } = state;
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  const handleDeposit = () => {
    if (!currentUser) return;

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      alert('Please enter a valid amount');
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
      description: `Deposit via ${paymentMethod}`,
      createdAt: new Date(),
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });

    alert('Deposit successful!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Deposit Funds</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="credit-card"
                  checked={paymentMethod === 'credit-card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm">Credit Card</span>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="bank-transfer"
                  checked={paymentMethod === 'bank-transfer'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm">Bank Transfer</span>
              </label>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Deposit Summary</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>${amount || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Fee:</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-blue-200">
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
              onClick={handleDeposit}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Deposit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}