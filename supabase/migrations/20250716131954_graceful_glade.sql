/*
  # Fix Anonymous Role Permissions

  1. Security Changes
    - Grant INSERT permissions to anonymous role for investment_plans table
    - Grant INSERT permissions to anonymous role for users table
    - Allow frontend to initialize investment plans and create users

  This migration fixes the RLS policy issues by granting necessary permissions
  to the anonymous role for initial data seeding and user creation.
*/

-- Grant INSERT permissions to anonymous role for investment_plans
GRANT INSERT ON public.investment_plans TO anon;

-- Grant INSERT permissions to anonymous role for users
GRANT INSERT ON public.users TO anon;

-- Grant SELECT permissions to anonymous role for investment_plans (already covered by policy but explicit grant)
GRANT SELECT ON public.investment_plans TO anon;

-- Grant SELECT permissions to anonymous role for users
GRANT SELECT ON public.users TO anon;