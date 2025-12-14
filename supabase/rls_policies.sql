-- Row Level Security Policies for Silk Market Application
-- Updated for password-protected admin (no Supabase Auth)
-- Run this in your Supabase SQL Editor after creating the schema

-- ============================================
-- COCOON RATES POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view cocoon rates" ON cocoon_rates;
DROP POLICY IF EXISTS "Admin can insert cocoon rates" ON cocoon_rates;
DROP POLICY IF EXISTS "Admin can update cocoon rates" ON cocoon_rates;
DROP POLICY IF EXISTS "Admin can delete cocoon rates" ON cocoon_rates;

-- Public users can SELECT (read-only)
CREATE POLICY "Public can view cocoon rates"
ON cocoon_rates
FOR SELECT
TO anon, authenticated
USING (true);

-- Disable direct INSERT, UPDATE, DELETE - only through RPC functions
-- RPC functions will handle password verification

-- ============================================
-- SILK PRICES POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view silk prices" ON silk_prices;
DROP POLICY IF EXISTS "Admin can insert silk prices" ON silk_prices;
DROP POLICY IF EXISTS "Admin can update silk prices" ON silk_prices;
DROP POLICY IF EXISTS "Admin can delete silk prices" ON silk_prices;

-- Public users can SELECT (read-only)
CREATE POLICY "Public can view silk prices"
ON silk_prices
FOR SELECT
TO anon, authenticated
USING (true);

-- Disable direct INSERT, UPDATE, DELETE - only through RPC functions
-- RPC functions will handle password verification

-- Note: All write operations (INSERT, UPDATE, DELETE) must go through RPC functions
-- which verify the admin password before allowing the operation.
