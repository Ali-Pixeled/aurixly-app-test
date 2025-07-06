import { supabase } from '../lib/supabase';
import { Transaction } from '../types';

export async function createTransaction(transactionData: Omit<Transaction, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: transactionData.userId,
        type: transactionData.type,
        amount: transactionData.amount,
        status: transactionData.status,
        description: transactionData.description,
        created_at: transactionData.createdAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      type: data.type,
      amount: data.amount,
      status: data.status,
      description: data.description,
      createdAt: new Date(data.created_at),
    } as Transaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}

export async function getUserTransactions(userId: string) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(tx => ({
      id: tx.id,
      userId: tx.user_id,
      type: tx.type,
      amount: tx.amount,
      status: tx.status,
      description: tx.description,
      createdAt: new Date(tx.created_at),
    })) as Transaction[];
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    throw error;
  }
}

export async function getAllTransactions() {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(tx => ({
      id: tx.id,
      userId: tx.user_id,
      type: tx.type,
      amount: tx.amount,
      status: tx.status,
      description: tx.description,
      createdAt: new Date(tx.created_at),
    })) as Transaction[];
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    throw error;
  }
}

export async function updateTransactionStatus(transactionId: string, status: 'pending' | 'completed' | 'failed') {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      type: data.type,
      amount: data.amount,
      status: data.status,
      description: data.description,
      createdAt: new Date(data.created_at),
    } as Transaction;
  } catch (error) {
    console.error('Error updating transaction status:', error);
    throw error;
  }
}