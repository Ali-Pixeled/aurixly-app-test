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

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'UPDATE_USER':
      // Update user in localStorage
      if (action.payload) {
        const storedUsers = JSON.parse(localStorage.getItem('aurixly_users') || '[]');
        const updatedUsers = storedUsers.map((u: User) => 
          u.id === action.payload.id ? action.payload : u
        );
        localStorage.setItem('aurixly_users', JSON.stringify(updatedUsers));
      }
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser,
      };
    case 'SET_INVESTMENTS':
      return { ...state, investments: action.payload };
    case 'ADD_INVESTMENT':
      // Save to localStorage
      if (state.currentUser) {
        const updatedInvestments = [...state.investments, action.payload];
        localStorage.setItem(`aurixly_investments_${state.currentUser.id}`, JSON.stringify(updatedInvestments));
      }
      return {
        ...state,
        investments: [...state.investments, action.payload],
      };
    case 'UPDATE_INVESTMENT':
      // Save to localStorage
      if (state.currentUser) {
        const updatedInvestments = state.investments.map(inv =>
          inv.id === action.payload.id ? action.payload : inv
        );
        localStorage.setItem(`aurixly_investments_${state.currentUser.id}`, JSON.stringify(updatedInvestments));
      }
      return {
        ...state,
        investments: state.investments.map(inv =>
          inv.id === action.payload.id ? action.payload : inv
        ),
      };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      // Save to localStorage
      if (state.currentUser) {
        const updatedTransactions = [...state.transactions, action.payload];
        localStorage.setItem(`aurixly_transactions_${state.currentUser.id}`, JSON.stringify(updatedTransactions));
      }
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
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

  // Initialize investment plans
  useEffect(() => {
    const fallbackPlans = [
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
    dispatch({ type: 'SET_INVESTMENT_PLANS', payload: fallbackPlans });
  }, []);

  // Handle user authentication with localStorage
  useEffect(() => {
    if (!isLoaded) return;

    if (clerkUser) {
      const userId = clerkUser.id;
      const storedUsers = JSON.parse(localStorage.getItem('aurixly_users') || '[]');
      
      let user = storedUsers.find((u: User) => u.clerkId === userId);
      
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
        
        storedUsers.push(user);
        localStorage.setItem('aurixly_users', JSON.stringify(storedUsers));
      }

      dispatch({ type: 'SET_CURRENT_USER', payload: user });
      dispatch({ type: 'SET_USERS', payload: storedUsers });

      // Load user data from localStorage
      const userInvestments = JSON.parse(localStorage.getItem(`aurixly_investments_${userId}`) || '[]')
        .map((inv: any) => ({
          ...inv,
          startDate: new Date(inv.startDate),
          endDate: new Date(inv.endDate),
          lastPayout: new Date(inv.lastPayout),
        }));
      
      const userTransactions = JSON.parse(localStorage.getItem(`aurixly_transactions_${userId}`) || '[]')
        .map((tx: any) => ({
          ...tx,
          createdAt: new Date(tx.createdAt),
        }));
      
      dispatch({ type: 'SET_INVESTMENTS', payload: userInvestments });
      dispatch({ type: 'SET_TRANSACTIONS', payload: userTransactions });
    } else {
      dispatch({ type: 'SET_CURRENT_USER', payload: null });
    }
  }, [isLoaded, clerkUser]);

  // Live profit calculation - runs every 5 seconds
  useEffect(() => {
    if (!state.currentUser) return;
    
    const interval = setInterval(() => {
      const activeInvestments = state.investments.filter(inv => 
        inv.userId === state.currentUser!.id && inv.isActive
      );

      let hasUpdates = false;
      const updatedInvestments = activeInvestments.map(investment => {
        const now = new Date();
        const secondsPassed = Math.floor((now.getTime() - investment.lastPayout.getTime()) / 1000);
        
        if (secondsPassed >= 5) { // Update every 5 seconds
          const hourlyProfit = (investment.amount || 0) * ((investment.hourlyRate || 0) / 100);
          const profitPerSecond = hourlyProfit / 3600; // Convert hourly to per second
          const newProfit = (investment.currentProfit || 0) + (profitPerSecond * secondsPassed);
          
          // Check if investment is complete
          const isComplete = now >= investment.endDate;
          
          // Calculate maximum possible profit
          const maxProfit = (investment.amount || 0) * ((investment.hourlyRate || 0) * (investment.duration || 0) / 100);
          const finalProfit = Math.min(newProfit, maxProfit);
          
          hasUpdates = true;
          return {
            ...investment,
            currentProfit: finalProfit,
            totalEarned: finalProfit,
            lastPayout: now,
            canWithdraw: isComplete,
            isActive: !isComplete,
          };
        }
        return investment;
      });

      if (hasUpdates) {
        updatedInvestments.forEach(investment => {
          dispatch({ type: 'UPDATE_INVESTMENT', payload: investment });
        });
      }
    }, 5000); // Check every 5 seconds

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