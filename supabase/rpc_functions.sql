-- Supabase RPC Functions for Password-Protected Admin Panel
-- Run this in your Supabase SQL Editor

-- Create admin_config table to store password hash securely
CREATE TABLE IF NOT EXISTS admin_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  password_hash TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default password hash (Silk@8123)
-- In production, use bcrypt to hash the password
-- For now, using plain text for simplicity - CHANGE THIS IN PRODUCTION
INSERT INTO admin_config (id, password_hash)
VALUES (1, 'Silk@8123')
ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Enable RLS on admin_config (only RPC functions can access)
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

-- Create policy to prevent direct access to admin_config
CREATE POLICY "No direct access to admin_config"
ON admin_config
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Create a function to verify admin password
CREATE OR REPLACE FUNCTION verify_admin_password(p_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_password_hash TEXT;
  is_valid BOOLEAN := FALSE;
BEGIN
  -- Get password hash from admin_config table
  SELECT password_hash INTO stored_password_hash
  FROM admin_config
  WHERE id = 1;
  
  -- Simple comparison (in production, use bcrypt or similar for hashing)
  -- For now, storing plain text - CHANGE THIS IN PRODUCTION
  IF p_password = stored_password_hash THEN
    is_valid := TRUE;
  END IF;
  
  RETURN is_valid;
END;
$$;

-- Function to insert cocoon rate (admin only)
CREATE OR REPLACE FUNCTION insert_cocoon_rate(
  p_password TEXT,
  p_location cocoon_location,
  p_date TIMESTAMP WITH TIME ZONE,
  p_max_price NUMERIC,
  p_avg_price NUMERIC,
  p_min_price NUMERIC,
  p_quantity NUMERIC
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  -- Verify admin password
  IF NOT verify_admin_password(p_password) THEN
    RAISE EXCEPTION 'Invalid admin password';
  END IF;
  
  -- Insert the record
  INSERT INTO cocoon_rates (location, date, max_price, avg_price, min_price, quantity)
  VALUES (p_location, p_date, p_max_price, p_avg_price, p_min_price, p_quantity)
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Function to update cocoon rate (admin only)
CREATE OR REPLACE FUNCTION update_cocoon_rate(
  p_password TEXT,
  p_id UUID,
  p_location cocoon_location DEFAULT NULL,
  p_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_max_price NUMERIC DEFAULT NULL,
  p_avg_price NUMERIC DEFAULT NULL,
  p_min_price NUMERIC DEFAULT NULL,
  p_quantity NUMERIC DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify admin password
  IF NOT verify_admin_password(p_password) THEN
    RAISE EXCEPTION 'Invalid admin password';
  END IF;
  
  -- Update only provided fields
  UPDATE cocoon_rates
  SET
    location = COALESCE(p_location, location),
    date = COALESCE(p_date, date),
    max_price = COALESCE(p_max_price, max_price),
    avg_price = COALESCE(p_avg_price, avg_price),
    min_price = COALESCE(p_min_price, min_price),
    quantity = COALESCE(p_quantity, quantity)
  WHERE id = p_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Cocoon rate not found';
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Function to delete cocoon rate (admin only)
CREATE OR REPLACE FUNCTION delete_cocoon_rate(
  p_password TEXT,
  p_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify admin password
  IF NOT verify_admin_password(p_password) THEN
    RAISE EXCEPTION 'Invalid admin password';
  END IF;
  
  DELETE FROM cocoon_rates WHERE id = p_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Cocoon rate not found';
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Function to insert silk price (admin only)
CREATE OR REPLACE FUNCTION insert_silk_price(
  p_password TEXT,
  p_location silk_location,
  p_price NUMERIC,
  p_date TIMESTAMP WITH TIME ZONE
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  -- Verify admin password
  IF NOT verify_admin_password(p_password) THEN
    RAISE EXCEPTION 'Invalid admin password';
  END IF;
  
  -- Insert the record
  INSERT INTO silk_prices (location, price, date)
  VALUES (p_location, p_price, p_date)
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Function to update silk price (admin only)
CREATE OR REPLACE FUNCTION update_silk_price(
  p_password TEXT,
  p_id UUID,
  p_location silk_location DEFAULT NULL,
  p_price NUMERIC DEFAULT NULL,
  p_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify admin password
  IF NOT verify_admin_password(p_password) THEN
    RAISE EXCEPTION 'Invalid admin password';
  END IF;
  
  -- Update only provided fields
  UPDATE silk_prices
  SET
    location = COALESCE(p_location, location),
    price = COALESCE(p_price, price),
    date = COALESCE(p_date, date)
  WHERE id = p_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Silk price not found';
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Function to delete silk price (admin only)
CREATE OR REPLACE FUNCTION delete_silk_price(
  p_password TEXT,
  p_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify admin password
  IF NOT verify_admin_password(p_password) THEN
    RAISE EXCEPTION 'Invalid admin password';
  END IF;
  
  DELETE FROM silk_prices WHERE id = p_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Silk price not found';
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Grant execute permissions to authenticated and anonymous users
-- (The RPC functions will verify password internally)
GRANT EXECUTE ON FUNCTION verify_admin_password(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION insert_cocoon_rate(TEXT, cocoon_location, TIMESTAMP WITH TIME ZONE, NUMERIC, NUMERIC, NUMERIC, NUMERIC) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_cocoon_rate(TEXT, UUID, cocoon_location, TIMESTAMP WITH TIME ZONE, NUMERIC, NUMERIC, NUMERIC, NUMERIC) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION delete_cocoon_rate(TEXT, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION insert_silk_price(TEXT, silk_location, NUMERIC, TIMESTAMP WITH TIME ZONE) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_silk_price(TEXT, UUID, silk_location, NUMERIC, TIMESTAMP WITH TIME ZONE) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION delete_silk_price(TEXT, UUID) TO anon, authenticated;

-- Note: In production, you should:
-- 1. Use bcrypt or similar for password hashing
-- 2. Store password hash securely (consider Supabase Vault)
-- 3. Add rate limiting to prevent brute force attacks
-- 4. Add audit logging for admin actions
-- 5. Consider adding session expiration
