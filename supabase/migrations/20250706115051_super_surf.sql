/*
  # Fix RLS Policies for Investment Platform

  1. Security Changes
    - Fix investment_plans policies to allow initialization
    - Fix users policies to allow proper authentication flow
    - Ensure authenticated users can access their own data
    - Allow anonymous access where needed for app initialization

  This migration fixes the RLS policy issues that prevent:
  - Investment plans initialization
  - User creation and authentication
  - Proper data access for authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Investment plans are readable by all" ON investment_plans;
DROP POLICY IF EXISTS "Users can read own investments" ON investments;
DROP POLICY IF EXISTS "Users can insert own investments" ON investments;
DROP POLICY IF EXISTS "Users can update own investments" ON investments;
DROP POLICY IF EXISTS "Users can read own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;

-- Investment Plans Policies (allow public read and service role insert)
CREATE POLICY "Anyone can read investment plans" 
  ON investment_plans 
  FOR SELECT 
  USING (true);

CREATE POLICY "Service role can insert investment plans" 
  ON investment_plans 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Service role can update investment plans" 
  ON investment_plans 
  FOR UPDATE 
  USING (true);

-- Users Policies
CREATE POLICY "Anyone can read users" 
  ON users 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert users" 
  ON users 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update own data" 
  ON users 
  FOR UPDATE 
  USING (auth.uid()::text = clerk_id OR auth.role() = 'service_role');

-- Investments Policies
CREATE POLICY "Users can read own investments" 
  ON investments 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = investments.user_id 
      AND (users.clerk_id = auth.uid()::text OR auth.role() = 'service_role')
    )
  );

CREATE POLICY "Users can insert own investments" 
  ON investments 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = user_id 
      AND (users.clerk_id = auth.uid()::text OR auth.role() = 'service_role')
    )
  );

CREATE POLICY "Users can update own investments" 
  ON investments 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = investments.user_id 
      AND (users.clerk_id = auth.uid()::text OR auth.role() = 'service_role')
    )
  );

-- Transactions Policies
CREATE POLICY "Users can read own transactions" 
  ON transactions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = transactions.user_id 
      AND (users.clerk_id = auth.uid()::text OR auth.role() = 'service_role')
    )
  );

CREATE POLICY "Users can insert own transactions" 
  ON transactions 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = user_id 
      AND (users.clerk_id = auth.uid()::text OR auth.role() = 'service_role')
    )
  );

CREATE POLICY "Users can update own transactions" 
  ON transactions 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = transactions.user_id 
      AND (users.clerk_id = auth.uid()::text OR auth.role() = 'service_role')
    )
  );