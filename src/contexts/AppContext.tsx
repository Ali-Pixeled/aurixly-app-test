import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';
import { AppState, User, Investment, InvestmentPlan, Transaction } from '../types';
import { 
  createUser, 
  getUserByClerkId, 
  updateUser, 
  getAllUsers 
} from '../services/userService';
import { 
  createInvestment, 
  getUserInvestments, 
  updateInvestment, 
  getAllInvestments 
} from '../services/investmentService';
import { 
  createTransaction, 
  getUserTransactions, 
  getAllTransactions 
} from '../services/transactionService';
import { 
  initializeInvestmentPlans, 
  getAllInvestmentPlans,
  updateInvestmentPlans
} from '../services/investmentPlanService';

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
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
  | { type: 'LOGOUT' };

const initialState: AppState = {
  currentUser: null,
  users: [],
  investments: [],
  investmentPlans: [],
  transactions: [],
  isLoading: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({ state: initialState, dispatch: () => {} });

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'UPDATE_USER':
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
      return {
        ...state,
        investments: [...state.investments, action.payload],
      };
    case 'UPDATE_INVESTMENT':
      return {
        ...state,
        investments: state.investments.map(inv =>
          inv.id === action.payload.id ? action.payload : inv
        ),
      };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
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
    case 'LOGOUT':
      return { ...state, currentUser: null };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user: clerkUser, isLoaded } = useUser();

  // Initialize investment plans first (independent of user)
  useEffect(() => {
    const initializePlans = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        console.log('Initializing investment plans...');
        
        // Get investment plans (this will handle initialization internally)
        const plans = await getAllInvestmentPlans();
        
        console.log('Investment plans loaded:', plans);
        dispatch({ type: 'SET_INVESTMENT_PLANS', payload: plans });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (error) {
        console.error('Error initializing investment plans:', error);
        // Set empty plans instead of error to allow app to continue
        dispatch({ type: 'SET_INVESTMENT_PLANS', payload: [] });
        dispatch({ type: 'SET_ERROR', payload: null });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    console.log('AppProvider mounted, initializing plans...');
    initializePlans();
  }, []);

  // Handle user authentication and data loading
  useEffect(() => {
    const initializeUser = async () => {
      console.log('initializeUser called, isLoaded:', isLoaded, 'clerkUser:', !!clerkUser);
      if (!isLoaded) return;

      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        if (clerkUser) {
          console.log('Initializing user:', clerkUser.id);
          
          try {
            let user = await getUserByClerkId(clerkUser.id);
            
            if (!user) {
              // Create new user if doesn't exist
              const userData = {
                clerkId: clerkUser.id,
                email: clerkUser.emailAddresses[0]?.emailAddress || '',
                name: clerkUser.fullName || clerkUser.firstName || 'User',
              };
              console.log('Creating new user:', userData);
              user = await createUser(userData);
            }

            console.log('User loaded:', user);
            dispatch({ type: 'SET_USER', payload: user });

            // Load user-specific data
            try {
              const userInvestments = await getUserInvestments(user.id);
              const userTransactions = await getUserTransactions(user.id);
              
              dispatch({ type: 'SET_INVESTMENTS', payload: userInvestments });
              dispatch({ type: 'SET_TRANSACTIONS', payload: userTransactions });
            } catch (error) {
              console.error('Error loading user data:', error);
            }

            // Load admin data if user is admin
            if (user.isAdmin) {
              try {
                const allUsers = await getAllUsers();
                const allInvestments = await getAllInvestments();
                const allTransactions = await getAllTransactions();
                
                dispatch({ type: 'SET_USERS', payload: allUsers });
                dispatch({ type: 'SET_INVESTMENTS', payload: allInvestments });
                dispatch({ type: 'SET_TRANSACTIONS', payload: allTransactions });
              } catch (error) {
                console.error('Error loading admin data:', error);
              }
            }
          } catch (error) {
            console.error('Error handling user authentication:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data' });
          }
        } else {
          // User is not logged in, clear user data but keep investment plans
          dispatch({ type: 'SET_USER', payload: null });
          dispatch({ type: 'SET_INVESTMENTS', payload: [] });
          dispatch({ type: 'SET_TRANSACTIONS', payload: [] });
          dispatch({ type: 'SET_USERS', payload: [] });
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize application' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeUser();
  }, [isLoaded, clerkUser]);

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