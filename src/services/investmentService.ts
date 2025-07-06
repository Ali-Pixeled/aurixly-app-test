import { supabase } from '../lib/supabase';
import { Investment } from '../types';

export async function createInvestment(investmentData: Omit<Investment, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('investments')
      .insert({
        user_id: investmentData.userId,
        plan_id: investmentData.planId,
        amount: investmentData.amount,
        start_date: investmentData.startDate.toISOString(),
        end_date: investmentData.endDate.toISOString(),
        hourly_rate: investmentData.hourlyRate,
        total_earned: investmentData.totalEarned,
        is_active: investmentData.isActive,
        last_payout: investmentData.lastPayout.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      planId: data.plan_id,
      amount: data.amount,
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
      hourlyRate: data.hourly_rate,
      totalEarned: data.total_earned,
      isActive: data.is_active,
      lastPayout: new Date(data.last_payout),
    } as Investment;
  } catch (error) {
    console.error('Error creating investment:', error);
    throw error;
  }
}

export async function getUserInvestments(userId: string) {
  try {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(inv => ({
      id: inv.id,
      userId: inv.user_id,
      planId: inv.plan_id,
      amount: inv.amount,
      startDate: new Date(inv.start_date),
      endDate: new Date(inv.end_date),
      hourlyRate: inv.hourly_rate,
      totalEarned: inv.total_earned,
      isActive: inv.is_active,
      lastPayout: new Date(inv.last_payout),
    })) as Investment[];
  } catch (error) {
    console.error('Error fetching user investments:', error);
    throw error;
  }
}

export async function updateInvestment(investmentId: string, updates: Partial<Investment>) {
  try {
    const updateData: any = {};
    
    if (updates.amount !== undefined) updateData.amount = updates.amount;
    if (updates.totalEarned !== undefined) updateData.total_earned = updates.totalEarned;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
    if (updates.lastPayout) updateData.last_payout = updates.lastPayout.toISOString();

    const { data, error } = await supabase
      .from('investments')
      .update(updateData)
      .eq('id', investmentId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      planId: data.plan_id,
      amount: data.amount,
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
      hourlyRate: data.hourly_rate,
      totalEarned: data.total_earned,
      isActive: data.is_active,
      lastPayout: new Date(data.last_payout),
    } as Investment;
  } catch (error) {
    console.error('Error updating investment:', error);
    throw error;
  }
}

export async function getAllInvestments() {
  try {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(inv => ({
      id: inv.id,
      userId: inv.user_id,
      planId: inv.plan_id,
      amount: inv.amount,
      startDate: new Date(inv.start_date),
      endDate: new Date(inv.end_date),
      hourlyRate: inv.hourly_rate,
      totalEarned: inv.total_earned,
      isActive: inv.is_active,
      lastPayout: new Date(inv.last_payout),
    })) as Investment[];
  } catch (error) {
    console.error('Error fetching all investments:', error);
    throw error;
  }
}