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
          min_amount: 2,
          max_amount: 20,
          hourly_rate: 0.06, // 20% over 2 weeks (336 hours) = 0.0595% per hour
          duration: 336, // 2 weeks (14 days * 24 hours)
          total_return: 20,
          featured: false,
        },
        {
          id: 'premium',
          name: 'Premium Plan',
          min_amount: 20,
          max_amount: 100,
          hourly_rate: 0.089, // 30% over 2 weeks
          duration: 336, // 2 weeks
          total_return: 30,
          featured: true,
        },
        {
          id: 'vip',
          name: 'VIP Plan',
          min_amount: 100,
          max_amount: 10000,
          hourly_rate: 0.119, // 40% over 2 weeks
          duration: 336, // 2 weeks
          total_return: 40,
          featured: false,
        },
      ];

      const { error } = await supabase
        .from('investment_plans')
        .insert(defaultPlans);

      if (error) throw error;
      console.log('Investment plans initialized successfully');
    } else {
      console.log('Investment plans already exist, count:', count);
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

    if (!data || data.length === 0) {
      console.log('No investment plans found, attempting to initialize...');
      await initializeInvestmentPlans();
      
      // Try fetching again after initialization
      const { data: retryData, error: retryError } = await supabase
        .from('investment_plans')
        .select('*')
        .order('min_amount', { ascending: true });
      
      if (retryError) throw retryError;
      
      return (retryData || []).map(plan => ({
        id: plan.id,
        name: plan.name,
        minAmount: plan.min_amount,
        maxAmount: plan.max_amount,
        hourlyRate: plan.hourly_rate,
        duration: plan.duration,
        totalReturn: plan.total_return,
        featured: plan.featured,
      })) as InvestmentPlan[];
    }

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

export async function updateInvestmentPlans() {
  try {
    // Update existing plans with new amounts
    const updates = [
      {
        id: 'starter',
        min_amount: 2,
        max_amount: 20,
      },
      {
        id: 'premium', 
        min_amount: 20,
        max_amount: 100,
      },
      {
        id: 'vip',
        min_amount: 100,
        max_amount: 10000,
      },
    ];

    for (const update of updates) {
      const { error } = await supabase
        .from('investment_plans')
        .update({
          min_amount: update.min_amount,
          max_amount: update.max_amount,
        })
        .eq('id', update.id);

      if (error) {
        console.error(`Error updating plan ${update.id}:`, error);
      } else {
        console.log(`Updated plan ${update.id} successfully`);
      }
    }
  } catch (error) {
    console.error('Error updating investment plans:', error);
    throw error;
  }
}