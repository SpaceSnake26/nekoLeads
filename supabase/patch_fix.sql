-- FIX SQL: ALIGN SCHEMA WITH CRM LOGIC

-- 1. Add created_at if it's missing (it was missing from initial schema)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Rename 'name' to 'pharmacy_name' to match the new CRM code
-- We use a DO block to safely check if the column 'name' exists before renaming
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='name') THEN
        ALTER TABLE leads RENAME COLUMN name TO pharmacy_name;
    END IF;
END $$;

-- 3. Ensure updated_at exists
ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. Re-run v2 migrations to ensure all other columns are present
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS has_ai_products BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS has_ai_chatbot BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 5. Status Enum (Ensuring it exists and is applied)
DO $$ BEGIN
    CREATE TYPE lead_status AS ENUM ('NEW', 'CONTACTED', 'REPLIED', 'QUALIFIED', 'WON', 'LOST');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE leads ADD COLUMN IF NOT EXISTS status lead_status DEFAULT 'NEW';
