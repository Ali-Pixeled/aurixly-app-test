/*
  # Add profit balance and investment tracking fields

  1. Changes to users table
    - Add profit_balance column to track separate profit wallet
    
  2. Changes to investments table  
    - Add current_profit column to track real-time profits
    - Add can_withdraw column to track withdrawal eligibility

  This migration adds the necessary fields for the separate profit wallet system.
*/

-- Add profit_balance to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'profit_balance'
  ) THEN
    ALTER TABLE users ADD COLUMN profit_balance DECIMAL(10,2) DEFAULT 0;
  END IF;
END $$;

-- Add current_profit to investments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'investments' AND column_name = 'current_profit'
  ) THEN
    ALTER TABLE investments ADD COLUMN current_profit DECIMAL(10,2) DEFAULT 0;
  END IF;
END $$;

-- Add can_withdraw to investments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'investments' AND column_name = 'can_withdraw'
  ) THEN
    ALTER TABLE investments ADD COLUMN can_withdraw BOOLEAN DEFAULT false;
  END IF;
END $$;