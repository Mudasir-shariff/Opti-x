-- Auto-delete job: Delete cocoon and silk data after 22 hours
-- This uses Supabase's pg_cron extension
-- Run this in your Supabase SQL Editor

-- Enable pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Function to delete old cocoon rates (older than 22 hours)
CREATE OR REPLACE FUNCTION delete_old_cocoon_rates()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM cocoon_rates
    WHERE created_at < NOW() - INTERVAL '22 hours';
END;
$$;

-- Function to delete old silk prices (older than 22 hours)
CREATE OR REPLACE FUNCTION delete_old_silk_prices()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM silk_prices
    WHERE created_at < NOW() - INTERVAL '22 hours';
END;
$$;

-- Schedule job to run every hour (checks and deletes data older than 22 hours)
-- This ensures data is deleted within 22-23 hours of creation
SELECT cron.schedule(
    'delete-old-market-data',
    '0 * * * *', -- Every hour at minute 0
    $$
    BEGIN
        PERFORM delete_old_cocoon_rates();
        PERFORM delete_old_silk_prices();
    END;
    $$
);

-- To manually test the cleanup functions:
-- SELECT delete_old_cocoon_rates();
-- SELECT delete_old_silk_prices();

-- To view scheduled jobs:
-- SELECT * FROM cron.job;

-- To unschedule the job (if needed):
-- SELECT cron.unschedule('delete-old-market-data');

