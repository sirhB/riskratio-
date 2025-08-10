-- Advanced Chart Features Schema
-- This script adds tables for chart settings, trade overlays, alerts, and analysis features

-- Chart Settings table (enhanced)
CREATE TABLE IF NOT EXISTS chart_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  timeframe VARCHAR(10) DEFAULT '1H',
  chart_type VARCHAR(20) DEFAULT 'candlestick',
  indicators JSONB DEFAULT '[]'::jsonb,
  color_scheme JSONB DEFAULT '{
    "upColor": "#26a69a",
    "downColor": "#ef5350", 
    "backgroundColor": "#1e293b",
    "gridColor": "#374151"
  }'::jsonb,
  layout_settings JSONB DEFAULT '{
    "showVolume": true,
    "showGrid": true,
    "showCrosshair": true,
    "showTimeScale": true,
    "showPriceScale": true
  }'::jsonb,
  drawing_tools JSONB DEFAULT '[]'::jsonb, -- Store trend lines, support/resistance
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, symbol)
);

-- Chart Screenshots table
CREATE TABLE IF NOT EXISTS chart_screenshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  trade_id UUID REFERENCES trades(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  screenshot_url TEXT NOT NULL,
  description TEXT,
  timeframe VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price Alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  alert_type VARCHAR(20) NOT NULL CHECK (alert_type IN ('price_above', 'price_below', 'price_cross')),
  target_price DECIMAL(15,8) NOT NULL,
  current_price DECIMAL(15,8),
  is_active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMP WITH TIME ZONE,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Watchlists table
CREATE TABLE IF NOT EXISTS watchlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  symbols JSONB DEFAULT '[]'::jsonb,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trade Analysis table (for enhanced analysis features)
CREATE TABLE IF NOT EXISTS trade_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  analysis_type VARCHAR(50) NOT NULL, -- 'heat_map', 'correlation', 'pattern_recognition'
  analysis_data JSONB NOT NULL,
  date_range_start DATE,
  date_range_end DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market Conditions table (for context analysis)
CREATE TABLE IF NOT EXISTS market_conditions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  volatility DECIMAL(8,4),
  volume BIGINT,
  trend_direction VARCHAR(10), -- 'bullish', 'bearish', 'sideways'
  market_sentiment VARCHAR(20), -- 'risk_on', 'risk_off', 'neutral'
  economic_events JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(date, symbol)
);

-- Trade Patterns table (for pattern recognition)
CREATE TABLE IF NOT EXISTS trade_patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pattern_name VARCHAR(100) NOT NULL,
  pattern_type VARCHAR(50) NOT NULL, -- 'setup', 'exit', 'market_condition'
  criteria JSONB NOT NULL, -- Pattern matching criteria
  success_rate DECIMAL(5,2),
  avg_return DECIMAL(10,2),
  trade_count INTEGER DEFAULT 0,
  last_occurrence TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Heat Map data
CREATE TABLE IF NOT EXISTS performance_heatmap (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  dimension_type VARCHAR(50) NOT NULL, -- 'hour_of_day', 'day_of_week', 'month', 'symbol'
  dimension_value VARCHAR(50) NOT NULL,
  total_trades INTEGER DEFAULT 0,
  winning_trades INTEGER DEFAULT 0,
  total_pnl DECIMAL(15,2) DEFAULT 0,
  avg_pnl DECIMAL(15,2) DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, dimension_type, dimension_value)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chart_settings_user_symbol ON chart_settings(user_id, symbol);
CREATE INDEX IF NOT EXISTS idx_chart_screenshots_user_trade ON chart_screenshots(user_id, trade_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_user_active ON price_alerts(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_watchlists_user ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_trade_analysis_user_type ON trade_analysis(user_id, analysis_type);
CREATE INDEX IF NOT EXISTS idx_market_conditions_date_symbol ON market_conditions(date, symbol);
CREATE INDEX IF NOT EXISTS idx_trade_patterns_user ON trade_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_heatmap_user_type ON performance_heatmap(user_id, dimension_type);

-- Create triggers for updated_at columns
CREATE TRIGGER update_chart_settings_updated_at 
    BEFORE UPDATE ON chart_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_price_alerts_updated_at 
    BEFORE UPDATE ON price_alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_watchlists_updated_at 
    BEFORE UPDATE ON watchlists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trade_patterns_updated_at 
    BEFORE UPDATE ON trade_patterns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default watchlist for existing users
INSERT INTO watchlists (user_id, name, symbols, is_default)
SELECT id, 'Default Watchlist', '["ES", "NQ", "EURUSD", "GBPUSD"]'::jsonb, true
FROM users
ON CONFLICT DO NOTHING;

-- Create function to update performance heatmap
CREATE OR REPLACE FUNCTION update_performance_heatmap()
RETURNS TRIGGER AS $$
BEGIN
    -- Update hour of day heatmap
    INSERT INTO performance_heatmap (user_id, dimension_type, dimension_value, total_trades, winning_trades, total_pnl, avg_pnl, win_rate)
    SELECT 
        NEW.user_id,
        'hour_of_day',
        EXTRACT(HOUR FROM NEW.trade_date AT TIME ZONE 'UTC')::text,
        COUNT(*),
        SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END),
        SUM(COALESCE(pnl, 0)),
        AVG(COALESCE(pnl, 0)),
        (SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*))
    FROM trades 
    WHERE user_id = NEW.user_id 
      AND status = 'Closed' 
      AND pnl IS NOT NULL
      AND EXTRACT(HOUR FROM trade_date AT TIME ZONE 'UTC') = EXTRACT(HOUR FROM NEW.trade_date AT TIME ZONE 'UTC')
    GROUP BY user_id
    ON CONFLICT (user_id, dimension_type, dimension_value) 
    DO UPDATE SET
        total_trades = EXCLUDED.total_trades,
        winning_trades = EXCLUDED.winning_trades,
        total_pnl = EXCLUDED.total_pnl,
        avg_pnl = EXCLUDED.avg_pnl,
        win_rate = EXCLUDED.win_rate,
        last_updated = NOW();

    -- Update day of week heatmap
    INSERT INTO performance_heatmap (user_id, dimension_type, dimension_value, total_trades, winning_trades, total_pnl, avg_pnl, win_rate)
    SELECT 
        NEW.user_id,
        'day_of_week',
        EXTRACT(DOW FROM NEW.trade_date)::text,
        COUNT(*),
        SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END),
        SUM(COALESCE(pnl, 0)),
        AVG(COALESCE(pnl, 0)),
        (SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*))
    FROM trades 
    WHERE user_id = NEW.user_id 
      AND status = 'Closed' 
      AND pnl IS NOT NULL
      AND EXTRACT(DOW FROM trade_date) = EXTRACT(DOW FROM NEW.trade_date)
    GROUP BY user_id
    ON CONFLICT (user_id, dimension_type, dimension_value) 
    DO UPDATE SET
        total_trades = EXCLUDED.total_trades,
        winning_trades = EXCLUDED.winning_trades,
        total_pnl = EXCLUDED.total_pnl,
        avg_pnl = EXCLUDED.avg_pnl,
        win_rate = EXCLUDED.win_rate,
        last_updated = NOW();

    -- Update symbol heatmap
    INSERT INTO performance_heatmap (user_id, dimension_type, dimension_value, total_trades, winning_trades, total_pnl, avg_pnl, win_rate)
    SELECT 
        NEW.user_id,
        'symbol',
        NEW.symbol,
        COUNT(*),
        SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END),
        SUM(COALESCE(pnl, 0)),
        AVG(COALESCE(pnl, 0)),
        (SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*))
    FROM trades 
    WHERE user_id = NEW.user_id 
      AND symbol = NEW.symbol
      AND status = 'Closed' 
      AND pnl IS NOT NULL
    GROUP BY user_id, symbol
    ON CONFLICT (user_id, dimension_type, dimension_value) 
    DO UPDATE SET
        total_trades = EXCLUDED.total_trades,
        winning_trades = EXCLUDED.winning_trades,
        total_pnl = EXCLUDED.total_pnl,
        avg_pnl = EXCLUDED.avg_pnl,
        win_rate = EXCLUDED.win_rate,
        last_updated = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update heatmap on trade changes
CREATE TRIGGER update_heatmap_on_trade_change
    AFTER INSERT OR UPDATE ON trades
    FOR EACH ROW
    WHEN (NEW.status = 'Closed' AND NEW.pnl IS NOT NULL)
    EXECUTE FUNCTION update_performance_heatmap();