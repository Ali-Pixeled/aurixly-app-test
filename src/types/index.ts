export interface User {
  id: string;
  clerkId?: string;
  email: string;
  name: string;
  balance: number;
  totalInvested: number;
  totalEarned: number;
  isAdmin: boolean;
  createdAt: Date;
}

export interface Investment {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  hourlyRate: number;
  totalEarned: number;
  isActive: boolean;
  lastPayout: Date;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  hourlyRate: number;
  duration: number; // in hours
  totalReturn: number;
  featured: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'profit';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: Date;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  investments: Investment[];
  investmentPlans: InvestmentPlan[];
  transactions: Transaction[];
  isLoading: boolean;
  error?: string | null;
}