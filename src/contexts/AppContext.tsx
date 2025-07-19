import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';
import { AppState, User, Investment, InvestmentPlan, Transaction } from '../types';
import { supabase } from '../lib/supabase';

type AppAction =
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_INVESTMENTS'; payload: Investment[] }
  | { type: 'ADD_INVESTMENT'; payload: Investment }
  | { type: 'UPDATE_INVESTMENT'; payload: Investment }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'SET_INVESTMENT_PLANS'; payload: InvestmentPlan[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  currentUser: null,
  users: [],
  investments: [],
  investmentPlans: [],
  transactions: [],
  isLoading: false,
  theme: (localStorage.getItem('aurixly_theme') as 'light' | 'dark') || 'light',
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({ state: initialState, dispatch: () => {} });

// Secure localStorage wrapper
const secureStorage = {
  set: (key: string, data: any) => {
    try {
      localStorage.setItem(`aurixly_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  get: (key: string) => {
    try {
      const item = localStorage.getItem(`aurixly_${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage retrieval error:', error);
      return null;
    }
  },
  remove: (key: string) => {
    localStorage.removeItem(`aurixly_${key}`);
  }
};

// Data validation functions
const validateUser = (user: any): User | null => {
  if (!user || typeof user !== 'object') return null;
  
  try {
    return {
      id: String(user.id || ''),
      clerkId: String(user.clerkId || ''),
      email: String(user.email || '').toLowerCase().trim(),
      name: String(user.name || '').trim(),
      balance: Math.max(0, Number(user.balance) || 0),
      profitBalance: Math.max(0, Number(user.profitBalance) || 0),
      totalInvested: Math.max(0, Number(user.totalInvested) || 0),
      totalEarned: Math.max(0, Number(user.totalEarned) || 0),
      isAdmin: Boolean(user.isAdmin),
      createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
    };
  } catch (error) {
    console.error('User validation error:', error);
    return null;
  }
};

const validateInvestment = (investment: any): Investment | null => {
  if (!investment || typeof investment !== 'object') return null;
  
  try {
    return {
      id: String(investment.id || ''),
      userId: String(investment.userId || ''),
      planId: String(investment.planId || ''),
      amount: Math.max(0, Number(investment.amount) || 0),
      startDate: new Date(investment.startDate),
      endDate: new Date(investment.endDate),
      hourlyRate: Math.max(0, Number(investment.hourlyRate) || 0),
      totalEarned: Math.max(0, Number(investment.totalEarned) || 0),
      currentProfit: Math.max(0, Number(investment.currentProfit) || 0),
      isActive: Boolean(investment.isActive),
      canWithdraw: Boolean(investment.canWithdraw),
      lastPayout: new Date(investment.lastPayout),
    };
  } catch (error) {
    console.error('Investment validation error:', error);
    return null;
  }
};

// Database operations
const dbOperations = {
  async saveUser(user: User) {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            clerk_id: user.clerkId,
            email: user.email,
            name: user.name,
            balance: user.balance,
            profit_balance: user.profitBalance,
            total_invested: user.totalInvested,
            total_earned: user.totalEarned,
            is_admin: user.isAdmin,
          });
        
        if (error) throw error;
        console.log('✅ User saved to Supabase');
      } catch (error) {
        console.warn('Supabase save failed, using localStorage:', error);
        secureStorage.set('currentUser', user);
      }
    } else {
      secureStorage.set('currentUser', user);
    }
  },

  async loadUser(clerkId: string): Promise<User | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('clerk_id', clerkId)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
          return {
            id: data.id,
            clerkId: data.clerk_id,
            email: data.email,
            name: data.name,
            balance: data.balance,
            profitBalance: data.profit_balance || 0,
            totalInvested: data.total_invested,
            totalEarned: data.total_earned,
            isAdmin: data.is_admin,
            createdAt: new Date(data.created_at),
          };
        }
      } catch (error) {
        console.warn('Supabase load failed, using localStorage:', error);
      }
    }
    
    return secureStorage.get('currentUser');
  },

  async saveInvestment(investment: Investment) {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('investments')
          .upsert({
            id: investment.id,
            user_id: investment.userId,
            plan_id: investment.planId,
            amount: investment.amount,
            start_date: investment.startDate.toISOString(),
            end_date: investment.endDate.toISOString(),
            hourly_rate: investment.hourlyRate,
            total_earned: investment.totalEarned,
            current_profit: investment.currentProfit,
            is_active: investment.isActive,
            can_withdraw: investment.canWithdraw,
            last_payout: investment.lastPayout.toISOString(),
          });
        
        if (error) throw error;
        console.log('✅ Investment saved to Supabase');
      } catch (error) {
        console.warn('Supabase investment save failed:', error);
        const investments = secureStorage.get('investments') || [];
        const index = investments.findIndex((inv: Investment) => inv.id === investment.id);
        if (index >= 0) {
          investments[index] = investment;
        } else {
          investments.push(investment);
        }
        secureStorage.set('investments', investments);
      }
    } else {
      const investments = secureStorage.get('investments') || [];
      const index = investments.findIndex((inv: Investment) => inv.id === investment.id);
      if (index >= 0) {
        investments[index] = investment;
      } else {
        investments.push(investment);
      }
      secureStorage.set('investments', investments);
    }
  },

  async loadInvestments(userId: string): Promise<Investment[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('investments')
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;
        
        return (data || []).map((inv: any) => ({
          id: inv.id,
          userId: inv.user_id,
          planId: inv.plan_id,
          amount: inv.amount,
          startDate: new Date(inv.start_date),
          endDate: new Date(inv.end_date),
          hourlyRate: inv.hourly_rate,
          totalEarned: inv.total_earned,
          currentProfit: inv.current_profit || 0,
          isActive: inv.is_active,
          canWithdraw: inv.can_withdraw || false,
          lastPayout: new Date(inv.last_payout),
        }));
      } catch (error) {
        console.warn('Supabase investments load failed:', error);
      }
    }
    
    const investments = secureStorage.get('investments') || [];
    return investments
      .filter((inv: any) => inv.userId === userId)
      .map(validateInvestment)
      .filter(Boolean);
  },

  async saveTransaction(transaction: Transaction) {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('transactions')
          .insert({
            id: transaction.id,
            user_id: transaction.userId,
            type: transaction.type,
            amount: transaction.amount,
            status: transaction.status,
            description: transaction.description,
            created_at: transaction.createdAt.toISOString(),
          });
        
        if (error) throw error;
        console.log('✅ Transaction saved to Supabase');
      } catch (error) {
        console.warn('Supabase transaction save failed:', error);
        const transactions = secureStorage.get('transactions') || [];
        transactions.push(transaction);
        secureStorage.set('transactions', transactions);
      }
    } else {
      const transactions = secureStorage.get('transactions') || [];
      transactions.push(transaction);
      secureStorage.set('transactions', transactions);
    }
  },

  async loadTransactions(userId: string): Promise<Transaction[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        return (data || []).map((tx: any) => ({
          id: tx.id,
          userId: tx.user_id,
          type: tx.type,
          amount: tx.amount,
          status: tx.status,
          description: tx.description,
          createdAt: new Date(tx.created_at),
        }));
      } catch (error) {
        console.warn('Supabase transactions load failed:', error);
      }
    }
    
    const transactions = secureStorage.get('transactions') || [];
    return transactions
      .filter((tx: any) => tx.userId === userId)
      .map((tx: any) => ({
        ...tx,
        createdAt: new Date(tx.createdAt),
      }));
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      console.log('Setting current user:', action.payload?.name);
      return { ...state, currentUser: action.payload };
      
    case 'SET_USERS':
      return { ...state, users: action.payload };
      
    case 'UPDATE_USER':
      const validatedUser = validateUser(action.payload);
      if (!validatedUser) return state;
      
      // Save to database
      dbOperations.saveUser(validatedUser);
      
      return {
        ...state,
        users: state.users.map(user =>
          user.id === validatedUser.id ? validatedUser : user
        ),
        currentUser: state.currentUser?.id === validatedUser.id ? validatedUser : state.currentUser,
      };
      
    case 'SET_INVESTMENTS':
      return { ...state, investments: action.payload };
      
    case 'ADD_INVESTMENT':
      const validatedInvestment = validateInvestment(action.payload);
      if (!validatedInvestment) return state;
      
      // Save to database
      dbOperations.saveInvestment(validatedInvestment);
      
      return { ...state, investments: [...state.investments, validatedInvestment] };
      
    case 'UPDATE_INVESTMENT':
      const validatedUpdateInvestment = validateInvestment(action.payload);
      if (!validatedUpdateInvestment) return state;
      
      // Save to database
      dbOperations.saveInvestment(validatedUpdateInvestment);
      
      return {
        ...state,
        investments: state.investments.map(inv =>
          inv.id === validatedUpdateInvestment.id ? validatedUpdateInvestment : inv
        ),
      };
      
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
      
    case 'ADD_TRANSACTION':
      // Save to database
      dbOperations.saveTransaction(action.payload);
      
      return { ...state, transactions: [...state.transactions, action.payload] };
      
    case 'SET_INVESTMENT_PLANS':
      return { ...state, investmentPlans: action.payload };
      
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    case 'SET_THEME':
      localStorage.setItem('aurixly_theme', action.payload);
      return { ...state, theme: action.payload };
      
    case 'LOGOUT':
      secureStorage.remove('currentUser');
      secureStorage.remove('investments');
      secureStorage.remove('transactions');
      return { ...state, currentUser: null, investments: [], transactions: [] };
      
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user: clerkUser, isLoaded } = useUser();

  // Initialize investment plans
  useEffect(() => {
    const investmentPlans: InvestmentPlan[] = [
      {
        id: 'starter',
        name: 'Starter Plan',
        minAmount: 2,
        maxAmount: 20,
        hourlyRate: 0.0595, // 20% over 2 weeks (336 hours)
        duration: 336,
        totalReturn: 20,
        featured: false,
      },
      {
        id: 'premium',
        name: 'Premium Plan',
        minAmount: 20,
        maxAmount: 100,
        hourlyRate: 0.0893, // 30% over 2 weeks
        duration: 336,
        totalReturn: 30,
        featured: true,
      },
      {
        id: 'vip',
        name: 'VIP Plan',
        minAmount: 100,
        maxAmount: 10000,
        hourlyRate: 0.119, // 40% over 2 weeks
        duration: 336,
        totalReturn: 40,
        featured: false,
      },
    ];
    
    dispatch({ type: 'SET_INVESTMENT_PLANS', payload: investmentPlans });
  }, []);

  // Handle user authentication
  useEffect(() => {
    if (!isLoaded) return;

    const loadUserData = async () => {
      if (clerkUser) {
        const userId = clerkUser.id;
        
        try {
          // Try to load user from database
          let user = await dbOperations.loadUser(userId);
          
          if (!user) {
            // Create new user
            user = {
              id: userId,
              clerkId: userId,
              email: clerkUser.emailAddresses[0]?.emailAddress || '',
              name: clerkUser.fullName || clerkUser.firstName || 'User',
              balance: 100, // Starting bonus
              profitBalance: 0,
              totalInvested: 0,
              totalEarned: 0,
              isAdmin: false,
              createdAt: new Date(),
            };
            
            await dbOperations.saveUser(user);
          }

          dispatch({ type: 'SET_CURRENT_USER', payload: user });

          // Load user investments and transactions
          const [investments, transactions] = await Promise.all([
            dbOperations.loadInvestments(userId),
            dbOperations.loadTransactions(userId)
          ]);
          
          dispatch({ type: 'SET_INVESTMENTS', payload: investments });
          dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
          
          console.log('✅ User data loaded:', user.name, 'Investments:', investments.length);
        } catch (error) {
          console.error('Error loading user data:', error);
          dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data' });
        }
      } else {
        dispatch({ type: 'SET_CURRENT_USER', payload: null });
      }
    };

    loadUserData();
  }, [isLoaded, clerkUser]);

  // Live profit calculation
  useEffect(() => {
    if (!state.currentUser) return;
    
    const interval = setInterval(() => {
      const activeInvestments = state.investments.filter(inv => 
        inv.userId === state.currentUser!.id && inv.isActive
      );

      if (activeInvestments.length === 0) return;

      let hasUpdates = false;
      let totalProfitIncrease = 0;

      activeInvestments.forEach(investment => {
        const now = new Date();
        const secondsPassed = Math.floor((now.getTime() - investment.lastPayout.getTime()) / 1000);
        
        // Update every 10 seconds
        if (secondsPassed >= 10) {
          const hourlyProfit = (investment.amount * investment.hourlyRate) / 100;
          const profitPerSecond = hourlyProfit / 3600;
          const newProfitIncrease = profitPerSecond * secondsPassed;
          
          if (newProfitIncrease > 0 && newProfitIncrease < investment.amount) {
            const newTotalProfit = investment.currentProfit + newProfitIncrease;
            const maxProfit = (investment.amount * investment.totalReturn) / 100;
            const finalProfit = Math.min(newTotalProfit, maxProfit);
            
            const isComplete = now >= investment.endDate || finalProfit >= maxProfit;
            
            const updatedInvestment = {
              ...investment,
              currentProfit: finalProfit,
              totalEarned: finalProfit,
              lastPayout: now,
              canWithdraw: isComplete,
              isActive: !isComplete,
            };
            
            dispatch({ type: 'UPDATE_INVESTMENT', payload: updatedInvestment });
            
            totalProfitIncrease += newProfitIncrease;
            hasUpdates = true;
            
            console.log(`💰 Investment ${investment.id}: +$${newProfitIncrease.toFixed(4)} (Total: $${finalProfit.toFixed(4)})`);
          }
        }
      });

      // Update user's profit balance
      if (hasUpdates && totalProfitIncrease > 0) {
        const updatedUser = {
          ...state.currentUser!,
          profitBalance: (state.currentUser!.profitBalance || 0) + totalProfitIncrease,
          totalEarned: state.currentUser!.totalEarned + totalProfitIncrease,
        };
        
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
        console.log(`📈 Total profit increase: +$${totalProfitIncrease.toFixed(4)}`);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [state.currentUser, state.investments]);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}