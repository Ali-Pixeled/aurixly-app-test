import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';
import { AppState, User, Investment, InvestmentPlan, Transaction } from '../types';

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

// Security: Input validation and sanitization
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
  } catch {
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
  } catch {
    return null;
  }
};

// Secure data storage with encryption-like encoding
const secureStore = {
  set: (key: string, data: any) => {
    try {
      const encoded = btoa(JSON.stringify(data));
      localStorage.setItem(`aurixly_${key}`, encoded);
    } catch (error) {
      console.error('Failed to store data:', error);
    }
  },
  get: (key: string) => {
    try {
      const encoded = localStorage.getItem(`aurixly_${key}`);
      if (!encoded) return null;
      return JSON.parse(atob(encoded));
    } catch (error) {
      console.error('Failed to retrieve data:', error);
      return null;
    }
  },
  remove: (key: string) => {
    localStorage.removeItem(`aurixly_${key}`);
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
      
      // Secure storage
      const storedUsers = secureStore.get('users') || [];
      const updatedUsers = storedUsers.map((u: User) => 
        u.id === validatedUser.id ? validatedUser : u
      );
      secureStore.set('users', updatedUsers);
      
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
      
      const newInvestments = [...state.investments, validatedInvestment];
      if (state.currentUser) {
        secureStore.set(`investments_${state.currentUser.id}`, newInvestments);
      }
      
      return { ...state, investments: newInvestments };
      
    case 'UPDATE_INVESTMENT':
      const validatedUpdateInvestment = validateInvestment(action.payload);
      if (!validatedUpdateInvestment) return state;
      
      const updatedInvestments = state.investments.map(inv =>
        inv.id === validatedUpdateInvestment.id ? validatedUpdateInvestment : inv
      );
      
      if (state.currentUser) {
        secureStore.set(`investments_${state.currentUser.id}`, updatedInvestments);
      }
      
      return { ...state, investments: updatedInvestments };
      
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
      
    case 'ADD_TRANSACTION':
      const newTransactions = [...state.transactions, action.payload];
      if (state.currentUser) {
        secureStore.set(`transactions_${state.currentUser.id}`, newTransactions);
      }
      return { ...state, transactions: newTransactions };
      
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
      return { ...state, currentUser: null };
      
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user: clerkUser, isLoaded } = useUser();

  // Initialize investment plans with proper security
  useEffect(() => {
    const investmentPlans: InvestmentPlan[] = [
      {
        id: 'starter',
        name: 'Starter Plan',
        minAmount: 2,
        maxAmount: 20,
        hourlyRate: 0.0595, // 20% over 2 weeks (336 hours) = 0.0595% per hour
        duration: 336, // 2 weeks in hours
        totalReturn: 20,
        featured: false,
      },
      {
        id: 'premium',
        name: 'Premium Plan',
        minAmount: 20,
        maxAmount: 100,
        hourlyRate: 0.0893, // 30% over 2 weeks = 0.0893% per hour
        duration: 336,
        totalReturn: 30,
        featured: true,
      },
      {
        id: 'vip',
        name: 'VIP Plan',
        minAmount: 100,
        maxAmount: 10000,
        hourlyRate: 0.119, // 40% over 2 weeks = 0.119% per hour
        duration: 336,
        totalReturn: 40,
        featured: false,
      },
    ];
    
    dispatch({ type: 'SET_INVESTMENT_PLANS', payload: investmentPlans });
  }, []);

  // Handle user authentication with secure storage
  useEffect(() => {
    if (!isLoaded) return;

    if (clerkUser) {
      const userId = clerkUser.id;
      const storedUsers = secureStore.get('users') || [];
      
      let user = storedUsers.find((u: User) => u.clerkId === userId);
      
      if (!user) {
        // Create new user with validation
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
        
        const validatedUser = validateUser(user);
        if (validatedUser) {
          storedUsers.push(validatedUser);
          secureStore.set('users', storedUsers);
          user = validatedUser;
        }
      }

      dispatch({ type: 'SET_CURRENT_USER', payload: user });
      dispatch({ type: 'SET_USERS', payload: storedUsers });

      // Load user data with validation
      const userInvestments = (secureStore.get(`investments_${userId}`) || [])
        .map(validateInvestment)
        .filter(Boolean);
      
      const userTransactions = (secureStore.get(`transactions_${userId}`) || [])
        .map((tx: any) => ({
          ...tx,
          createdAt: new Date(tx.createdAt),
        }));
      
      dispatch({ type: 'SET_INVESTMENTS', payload: userInvestments });
      dispatch({ type: 'SET_TRANSACTIONS', payload: userTransactions });
      
      console.log('User loaded:', user.name, 'Investments:', userInvestments.length);
    } else {
      dispatch({ type: 'SET_CURRENT_USER', payload: null });
    }
  }, [isLoaded, clerkUser]);

  // FIXED: Live profit calculation with proper security and validation
  useEffect(() => {
    if (!state.currentUser) return;
    
    console.log('Setting up profit calculation interval...');
    
    const interval = setInterval(() => {
      const activeInvestments = state.investments.filter(inv => 
        inv.userId === state.currentUser!.id && inv.isActive
      );

      if (activeInvestments.length === 0) return;

      console.log('Calculating profits for', activeInvestments.length, 'active investments');

      let hasUpdates = false;
      let totalProfitIncrease = 0;

      activeInvestments.forEach(investment => {
        const now = new Date();
        const secondsPassed = Math.floor((now.getTime() - investment.lastPayout.getTime()) / 1000);
        
        // Update every 10 seconds for visible progress
        if (secondsPassed >= 10) {
          // Calculate profit per second
          const hourlyProfit = (investment.amount * investment.hourlyRate) / 100;
          const profitPerSecond = hourlyProfit / 3600;
          const newProfitIncrease = profitPerSecond * secondsPassed;
          
          // Security: Validate profit calculations
          if (newProfitIncrease > 0 && newProfitIncrease < investment.amount) {
            const newTotalProfit = investment.currentProfit + newProfitIncrease;
            
            // Check if investment period is complete
            const isComplete = now >= investment.endDate;
            const maxProfit = (investment.amount * investment.totalReturn) / 100;
            const finalProfit = Math.min(newTotalProfit, maxProfit);
            
            const updatedInvestment = {
              ...investment,
              currentProfit: finalProfit,
              totalEarned: finalProfit,
              lastPayout: now,
              canWithdraw: isComplete,
              isActive: !isComplete && finalProfit < maxProfit,
            };
            
            dispatch({ type: 'UPDATE_INVESTMENT', payload: updatedInvestment });
            
            totalProfitIncrease += newProfitIncrease;
            hasUpdates = true;
            
            console.log(`Investment ${investment.id}: +$${newProfitIncrease.toFixed(4)} (Total: $${finalProfit.toFixed(2)})`);
          }
        }
      });

      // Update user's profit balance
      if (hasUpdates && totalProfitIncrease > 0) {
        const updatedUser = {
          ...state.currentUser!,
          profitBalance: (state.currentUser!.profitBalance || 0) + totalProfitIncrease,
        };
        
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
        console.log(`Total profit increase: +$${totalProfitIncrease.toFixed(4)}`);
      }
    }, 10000); // Check every 10 seconds

    return () => {
      console.log('Clearing profit calculation interval');
      clearInterval(interval);
    };
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