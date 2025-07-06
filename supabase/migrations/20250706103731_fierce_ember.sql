/*
  # Fix Investment Plans RLS Policy

  1. Security Changes
    - Add INSERT policy for investment_plans table to allow initialization
    - Allow anonymous users to insert investment plans for seeding purposes
    - Maintain existing SELECT policy for reading plans

  This migration fixes the RLS policy issue that prevents the application from
  initializing default investment plans on startup.
*/

-- Add INSERT policy for investment_plans to allow initialization
CREATE POLICY "Allow insert for investment plans initialization" 
  ON investment_plans 
  FOR INSERT 
  WITH CHECK (true);

-- Optional: If you want to restrict INSERT to only service role in the future,
-- you can replace the above policy with this more restrictive one:
-- CREATE POLICY "Service role can insert investment plans" 
--   ON investment_plans 
--   FOR INSERT 
--   TO service_role
--   WITH CHECK (true);