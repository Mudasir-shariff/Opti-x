-- Update Admin Password to Silk@8123
-- Run this in your Supabase SQL Editor if you've already set up the database

-- Update the password in admin_config table
UPDATE admin_config 
SET password_hash = 'Silk@8123',
    updated_at = NOW()
WHERE id = 1;

-- Verify the password was updated
SELECT id, updated_at, 
       CASE 
         WHEN password_hash = 'Silk@8123' THEN 'Password updated successfully!'
         ELSE 'Password update failed!'
       END as status
FROM admin_config
WHERE id = 1;

-- Test the password verification
SELECT verify_admin_password('Silk@8123') as is_valid;

