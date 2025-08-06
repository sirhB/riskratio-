-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  -- Trading Settings
  default_leverage DECIMAL(5,2) DEFAULT 1.00,
  account_currency VARCHAR(3) DEFAULT 'USD',
  account_balance DECIMAL(15,2) DEFAULT 10000.00,
  risk_per_trade DECIMAL(5,2) DEFAULT 2.00, -- percentage
  
  -- Display Settings
  timezone VARCHAR(50) DEFAULT 'UTC',
  date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
  theme VARCHAR(10) DEFAULT 'dark',
  
  -- Notification Settings
  email_notifications BOOLEAN DEFAULT true,
  trade_alerts BOOLEAN DEFAULT true,
  performance_reports BOOLEAN DEFAULT true,
  
  -- Privacy Settings
  data_sharing BOOLEAN DEFAULT false,
  analytics_tracking BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add unique constraint on user_id
  UNIQUE(user_id)
);

-- Add leverage column to trades table
ALTER TABLE trades ADD COLUMN IF NOT EXISTS leverage DECIMAL(5,2) DEFAULT 1.00;

-- Add contract_size column for proper P&L calculation
ALTER TABLE trades ADD COLUMN IF NOT EXISTS contract_size DECIMAL(15,2) DEFAULT 1.00;

-- Update the P&L calculation to include leverage
-- Drop the existing generated column first if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'trades' AND column_name = 'pnl') THEN
        ALTER TABLE trades DROP COLUMN pnl;
    END IF;
END $$;

-- Add new P&L column with leverage calculation
ALTER TABLE trades ADD COLUMN pnl DECIMAL(10, 2) GENERATED ALWAYS AS (
  CASE 
    WHEN exit_price IS NOT NULL THEN
      CASE 
        WHEN side = 'Long' THEN (exit_price - entry_price) * quantity * contract_size * leverage
        WHEN side = 'Short' THEN (entry_price - exit_price) * quantity * contract_size * leverage
      END
    ELSE 0
  END
) STORED;

-- Create trigger for user_settings updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_settings_updated_at 
    BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings for existing users
INSERT INTO user_settings (user_id)
SELECT id FROM users
ON CONFLICT (user_id) DO NOTHING;

-- Update existing trades with default contract sizes based on instrument type
UPDATE trades SET 
  contract_size = CASE 
    -- Futures contract sizes
    WHEN symbol = 'ES' THEN 50.00      -- S&P 500 E-mini
    WHEN symbol = 'NQ' THEN 20.00      -- NASDAQ E-mini
    WHEN symbol = 'YM' THEN 5.00       -- Dow E-mini
    WHEN symbol = 'RTY' THEN 10.00     -- Russell 2000 E-mini
    WHEN symbol = 'CL' THEN 1000.00    -- Crude Oil
    WHEN symbol = 'NG' THEN 10000.00   -- Natural Gas
    WHEN symbol = 'GC' THEN 100.00     -- Gold
    WHEN symbol = 'SI' THEN 5000.00    -- Silver
    WHEN symbol = 'ZB' THEN 1000.00    -- 30-Year Treasury Bond
    WHEN symbol = 'ZN' THEN 1000.00    -- 10-Year Treasury Note
    WHEN symbol = 'ZF' THEN 1000.00    -- 5-Year Treasury Note
    WHEN symbol = 'ZT' THEN 2000.00    -- 2-Year Treasury Note
    WHEN symbol = '6E' THEN 125000.00  -- Euro FX
    WHEN symbol = '6B' THEN 62500.00   -- British Pound
    WHEN symbol = '6A' THEN 100000.00  -- Australian Dollar
    WHEN symbol = '6J' THEN 12500000.00 -- Japanese Yen
    WHEN symbol = '6S' THEN 125000.00  -- Swiss Franc
    WHEN symbol = '6C' THEN 100000.00  -- Canadian Dollar
    -- Forex standard lot sizes (100,000 units of base currency)
    WHEN LENGTH(symbol) = 6 THEN 100000.00
    ELSE 1.00
  END,
  leverage = 1.00
WHERE contract_size = 1.00 OR contract_size IS NULL;
