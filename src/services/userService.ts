import { supabase } from '../lib/supabase';
import { User } from '../types';

export async function createUser(userData: { clerkId: string; email: string; name: string }) {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        clerk_id: userData.clerkId,
        email: userData.email,
        name: userData.name,
        balance: 100, // Starting bonus
        total_invested: 0,
        total_earned: 0,
        is_admin: false,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      clerkId: data.clerk_id,
      email: data.email,
      name: data.name,
      balance: data.balance,
      totalInvested: data.total_invested,
      totalEarned: data.total_earned,
      isAdmin: data.is_admin,
      createdAt: new Date(data.created_at),
    } as User;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }

    return {
      id: data.id,
      clerkId: data.clerk_id,
      email: data.email,
      name: data.name,
      balance: data.balance,
      totalInvested: data.total_invested,
      totalEarned: data.total_earned,
      isAdmin: data.is_admin,
      createdAt: new Date(data.created_at),
    } as User;
  } catch (error) {
    console.error('Error fetching user by Clerk ID:', error);
    throw error;
  }
}

export async function updateUser(userId: string, updates: Partial<User>) {
  try {
    const updateData: any = {};
    
    if (updates.email) updateData.email = updates.email;
    if (updates.name) updateData.name = updates.name;
    if (updates.balance !== undefined) updateData.balance = updates.balance;
    if (updates.totalInvested !== undefined) updateData.total_invested = updates.totalInvested;
    if (updates.totalEarned !== undefined) updateData.total_earned = updates.totalEarned;
    if (updates.isAdmin !== undefined) updateData.is_admin = updates.isAdmin;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      clerkId: data.clerk_id,
      email: data.email,
      name: data.name,
      balance: data.balance,
      totalInvested: data.total_invested,
      totalEarned: data.total_earned,
      isAdmin: data.is_admin,
      createdAt: new Date(data.created_at),
    } as User;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(user => ({
      id: user.id,
      clerkId: user.clerk_id,
      email: user.email,
      name: user.name,
      balance: user.balance,
      totalInvested: user.total_invested,
      totalEarned: user.total_earned,
      isAdmin: user.is_admin,
      createdAt: new Date(user.created_at),
    })) as User[];
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}