-- Add password field to users table for authentication
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Update the demo user with a password for testing
UPDATE users 
SET password_hash = 'demo123456' 
WHERE email = 'demo@tradezella.com';
