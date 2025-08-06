-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert admin user with login key "trustgod"
INSERT INTO admin_users (username, password_hash, role) 
VALUES ('admin', 'trustgod', 'super_admin')
ON CONFLICT (username) DO UPDATE SET password_hash = 'trustgod';

-- Update trades table to ensure proper user isolation
-- Add user_id foreign key constraint if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'trades_user_id_fkey'
    ) THEN
        ALTER TABLE trades ADD CONSTRAINT trades_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create indexes for admin queries
CREATE INDEX IF NOT EXISTS idx_trades_user_pnl ON trades(user_id, pnl) WHERE pnl IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_trades_created_at ON trades(created_at);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Create a view for admin analytics (privacy-safe)
CREATE OR REPLACE VIEW admin_user_stats AS
SELECT 
    u.id as user_id,
    CONCAT('User_', SUBSTRING(u.id::text, 1, 8)) as anonymous_id,
    u.created_at as user_created_at,
    COUNT(t.id) as total_trades,
    COUNT(CASE WHEN t.status = 'Closed' AND t.pnl > 0 THEN 1 END) as winning_trades,
    COUNT(CASE WHEN t.status = 'Closed' AND t.pnl < 0 THEN 1 END) as losing_trades,
    COALESCE(SUM(CASE WHEN t.status = 'Closed' THEN t.pnl END), 0) as total_pnl,
    COALESCE(AVG(CASE WHEN t.status = 'Closed' AND t.pnl > 0 THEN t.pnl END), 0) as avg_win,
    COALESCE(AVG(CASE WHEN t.status = 'Closed' AND t.pnl < 0 THEN t.pnl END), 0) as avg_loss,
    CASE 
        WHEN COUNT(CASE WHEN t.status = 'Closed' THEN 1 END) > 0 
        THEN ROUND((COUNT(CASE WHEN t.status = 'Closed' AND t.pnl > 0 THEN 1 END)::decimal / COUNT(CASE WHEN t.status = 'Closed' THEN 1 END)) * 100, 1)
        ELSE 0 
    END as win_rate,
    MAX(t.created_at) as last_trade_date
FROM users u
LEFT JOIN trades t ON u.id = t.user_id
GROUP BY u.id, u.created_at;

-- Create trigger to update admin_users updated_at
CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
