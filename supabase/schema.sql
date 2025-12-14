-- Supabase Database Schema for Silk Market Application
-- Run this in your Supabase SQL Editor

-- Create enum types for locations
CREATE TYPE cocoon_location AS ENUM ('Sidlaghatta', 'Ramanagar', 'Kollegal');
CREATE TYPE silk_location AS ENUM ('Sidlaghatta', 'Ramanagar', 'Kollegal', 'Bangalore');

-- Cocoon Rates Table
CREATE TABLE IF NOT EXISTS cocoon_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location cocoon_location NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    max_price NUMERIC(10, 2) NOT NULL CHECK (max_price >= 0),
    avg_price NUMERIC(10, 2) NOT NULL CHECK (avg_price >= 0),
    min_price NUMERIC(10, 2) NOT NULL CHECK (min_price >= 0),
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity >= 0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Silk Prices Table
CREATE TABLE IF NOT EXISTS silk_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location silk_location NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cocoon_rates_date ON cocoon_rates(date DESC);
CREATE INDEX IF NOT EXISTS idx_cocoon_rates_location ON cocoon_rates(location);
CREATE INDEX IF NOT EXISTS idx_cocoon_rates_created_at ON cocoon_rates(created_at);

CREATE INDEX IF NOT EXISTS idx_silk_prices_date ON silk_prices(date DESC);
CREATE INDEX IF NOT EXISTS idx_silk_prices_location ON silk_prices(location);
CREATE INDEX IF NOT EXISTS idx_silk_prices_created_at ON silk_prices(created_at);

-- Enable Row Level Security
ALTER TABLE cocoon_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE silk_prices ENABLE ROW LEVEL SECURITY;

