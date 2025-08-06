-- Clear existing trades and add futures/forex trades
DELETE FROM trades WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';

-- Insert futures and forex trades
INSERT INTO trades (user_id, symbol, side, quantity, entry_price, exit_price, trade_date, strategy, notes, status) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'ES', 'Long', 2, 4485.50, 4510.25, '2024-01-15', 'Breakout', 'S&P 500 futures breakout above resistance', 'Closed'),
('550e8400-e29b-41d4-a716-446655440000', 'EURUSD', 'Short', 1.5, 1.0875, 1.0820, '2024-01-14', 'Momentum', 'EUR weakness after ECB dovish comments', 'Closed'),
('550e8400-e29b-41d4-a716-446655440000', 'NQ', 'Long', 1, 15420.00, 15380.50, '2024-01-13', 'Swing', 'NASDAQ futures failed swing setup', 'Closed'),
('550e8400-e29b-41d4-a716-446655440000', 'GBPUSD', 'Long', 2.0, 1.2650, 1.2720, '2024-01-12', 'Reversal', 'GBP reversal at key support level', 'Closed'),
('550e8400-e29b-41d4-a716-446655440000', 'CL', 'Long', 3, 72.50, NULL, '2024-01-11', 'Momentum', 'Crude oil momentum play - still holding', 'Open'),
('550e8400-e29b-41d4-a716-446655440000', 'USDJPY', 'Short', 1.0, 148.25, 147.80, '2024-01-10', 'News', 'USD/JPY short on BoJ intervention fears', 'Closed'),
('550e8400-e29b-41d4-a716-446655440000', 'GC', 'Long', 2, 2045.80, 2065.20, '2024-01-09', 'Technical', 'Gold futures technical breakout', 'Closed'),
('550e8400-e29b-41d4-a716-446655440000', 'AUDUSD', 'Long', 1.5, 0.6720, 0.6785, '2024-01-08', 'Momentum', 'AUD strength on commodity rally', 'Closed')
ON CONFLICT DO NOTHING;
