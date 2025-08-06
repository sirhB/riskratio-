-- Insert sample user
INSERT INTO users (id, email, full_name) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'demo@tradezella.com', 'Demo User')
ON CONFLICT (email) DO NOTHING;

-- Insert sample trades
INSERT INTO trades (user_id, symbol, side, quantity, entry_price, exit_price, trade_date, strategy, notes, status) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'AAPL', 'Long', 100, 150.00, 155.50, '2024-01-15', 'Breakout', 'Strong breakout above resistance', 'Closed'),
('550e8400-e29b-41d4-a716-446655440000', 'TSLA', 'Short', 50, 240.00, 235.00, '2024-01-14', 'Momentum', 'Bearish momentum after earnings', 'Closed'),
('550e8400-e29b-41d4-a716-446655440000', 'MSFT', 'Long', 75, 380.00, 375.00, '2024-01-13', 'Swing', 'Failed swing trade setup', 'Closed'),
('550e8400-e29b-41d4-a716-446655440000', 'GOOGL', 'Long', 25, 140.00, 145.00, '2024-01-12', 'Reversal', 'Reversal at support level', 'Closed'),
('550e8400-e29b-41d4-a716-446655440000', 'NVDA', 'Long', 30, 500.00, NULL, '2024-01-11', 'Momentum', 'AI momentum play - still holding', 'Open'),
('550e8400-e29b-41d4-a716-446655440000', 'SPY', 'Long', 200, 480.00, 485.00, '2024-01-10', 'Index', 'Market index trade', 'Closed'),
('550e8400-e29b-41d4-a716-446655440000', 'QQQ', 'Short', 100, 390.00, 385.00, '2024-01-09', 'Index', 'Tech sector short', 'Closed'),
('550e8400-e29b-41d4-a716-446655440000', 'AMD', 'Long', 150, 120.00, 125.00, '2024-01-08', 'Momentum', 'Semiconductor momentum', 'Closed')
ON CONFLICT DO NOTHING;
