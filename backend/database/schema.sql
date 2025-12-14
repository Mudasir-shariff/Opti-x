-- Silk Market Database Schema
-- Create database
CREATE DATABASE IF NOT EXISTS silk_market;
USE silk_market;

-- Cocoon Rates Table
-- Stores daily cocoon price data by location
CREATE TABLE IF NOT EXISTS cocoon_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    max_price DECIMAL(10, 2) NOT NULL,
    avg_price DECIMAL(10, 2) NOT NULL,
    min_price DECIMAL(10, 2) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_location (location),
    INDEX idx_date (date),
    INDEX idx_location_date (location, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Silk Prices Table
-- Stores daily silk price data by location
CREATE TABLE IF NOT EXISTS silk_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_location (location),
    INDEX idx_date (date),
    INDEX idx_location_date (location, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample Data (Optional - for testing)
-- Insert sample cocoon rates
INSERT INTO cocoon_rates (location, date, max_price, avg_price, min_price, quantity) VALUES
('Karnataka', '2024-01-15', 450.00, 420.00, 400.00, 1500.00),
('Karnataka', '2024-01-16', 460.00, 430.00, 410.00, 1800.00),
('Tamil Nadu', '2024-01-15', 440.00, 410.00, 390.00, 1200.00),
('Tamil Nadu', '2024-01-16', 450.00, 420.00, 400.00, 1400.00),
('West Bengal', '2024-01-15', 470.00, 440.00, 420.00, 2000.00),
('West Bengal', '2024-01-16', 480.00, 450.00, 430.00, 2200.00);

-- Insert sample silk prices
INSERT INTO silk_prices (location, price, date) VALUES
('Karnataka', 3500.00, '2024-01-15'),
('Karnataka', 3550.00, '2024-01-16'),
('Tamil Nadu', 3450.00, '2024-01-15'),
('Tamil Nadu', 3500.00, '2024-01-16'),
('West Bengal', 3600.00, '2024-01-15'),
('West Bengal', 3650.00, '2024-01-16');

