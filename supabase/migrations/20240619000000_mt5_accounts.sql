-- Create mt5_accounts table for storing MetaTrader 5 account connections
CREATE TABLE IF NOT EXISTS public.mt5_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Reserved for future auth implementation
  account_login TEXT NOT NULL,
  account_server TEXT NOT NULL,
  account_password TEXT NOT NULL, -- In production, this should be encrypted
  account_type TEXT NOT NULL CHECK (account_type IN ('demo', 'real')),
  balance NUMERIC(15, 2) DEFAULT 0.00,
  equity NUMERIC(15, 2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mt5_accounts_user_id ON public.mt5_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_mt5_accounts_is_active ON public.mt5_accounts(is_active);
CREATE INDEX IF NOT EXISTS idx_mt5_accounts_account_type ON public.mt5_accounts(account_type);

-- Enable Row Level Security
ALTER TABLE public.mt5_accounts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Allow public read access" ON public.mt5_accounts;
DROP POLICY IF EXISTS "Allow public insert access" ON public.mt5_accounts;
DROP POLICY IF EXISTS "Allow public update access" ON public.mt5_accounts;
DROP POLICY IF EXISTS "Allow public delete access" ON public.mt5_accounts;

-- Create RLS policies for public access (demo mode)
-- In production, these should be restricted to auth.uid()
CREATE POLICY "Allow public read access"
  ON public.mt5_accounts
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access"
  ON public.mt5_accounts
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON public.mt5_accounts
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON public.mt5_accounts
  FOR DELETE
  TO anon
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_mt5_accounts_updated_at ON public.mt5_accounts;
CREATE TRIGGER update_mt5_accounts_updated_at
  BEFORE UPDATE ON public.mt5_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to ensure only one account is active at a time
CREATE OR REPLACE FUNCTION public.ensure_single_active_account()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    -- Deactivate all other accounts
    UPDATE public.mt5_accounts
    SET is_active = false
    WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for single active account
DROP TRIGGER IF EXISTS ensure_single_active_account_trigger ON public.mt5_accounts;
CREATE TRIGGER ensure_single_active_account_trigger
  BEFORE UPDATE ON public.mt5_accounts
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION public.ensure_single_active_account();
