import { supabase } from '../lib/supabase';
import { InvestmentPlan } from '../types';

export async function initializeInvestmentPlans() {
  try {
    const { count, error: countError } = await supabase
      .from('investment_plans')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    if (count === 0) {
      const defaultPlans = [
        {
          id: 'starter',
          name: 'Starter Plan',
          min_amount: 10,
          max_amount: 500,
          hourly_rate: 0.5,
          duration: 240, // 10 days
          total_return: 120,
          featured: false,
        },
        {
          id: 'premium',
          name: 'Premium Plan',
          min_amount: 500,
          max_amount: 2000,
          hourly_rate: 0.75,
          duration: 168, // 7 days
          total_return: 126,
          featured: true,
        },
        {
          id: 'vip',
          name: 'VIP Plan',
          min_amount: 2000,
          max_amount: 10000,
          hourly_rate: 1.2,
          duration: 120, // 5 days
          total_return: 144,
          featured: false,
        },
      ];

      const { error } = await supabase
        .from('investment_plans')
        .insert(defaultPlans);

      if (error) throw error;
      console.log('Investment plans initialized');
    }
  } catch (error) {
    console.error('Error initializing investment plans:', error);
    throw error;
  }
}

export async function getAllInvestmentPlans() {
  try {
    const { data, error } = await supabase
      .from('investment_plans')
      .select('*')
      .order('min_amount', { ascending: true });

    if (error) throw error;

    return data.map(plan => ({
      id: plan.id,
      name: plan.name,
      minAmount: plan.min_amount,
      maxAmount: plan.max_amount,
      hourlyRate: plan.hourly_rate,
      duration: plan.duration,
      totalReturn: plan.total_return,
      featured: plan.featured,
    })) as InvestmentPlan[];
  } catch (error) {
    console.error('Error fetching investment plans:', error);
    throw error;
  }
}