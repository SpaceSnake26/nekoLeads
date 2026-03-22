-- PHARMACY LEADS CRM EXTENSION SCHEMA (v2)

-- Update leads table with CRM fields
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS has_ai_products BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS has_ai_chatbot BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create Status Enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE lead_status AS ENUM ('NEW', 'CONTACTED', 'REPLIED', 'QUALIFIED', 'WON', 'LOST');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE leads ADD COLUMN IF NOT EXISTS status lead_status DEFAULT 'NEW';

-- Create Survey Configuration table
CREATE TABLE IF NOT EXISTS surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL DEFAULT 'Pharmacy IT Situation Survey',
    intro_text TEXT,
    company_name TEXT,
    company_contact TEXT,
    consent_text TEXT DEFAULT 'I agree to the privacy policy and terms.',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a default survey for MVP
INSERT INTO surveys (title, company_name) 
SELECT 'Pharmacy Digitalization Survey', 'Pharmacy Leads CH'
WHERE NOT EXISTS (SELECT 1 FROM surveys);

-- Create Survey Responses table
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID REFERENCES surveys(id),
    lead_id UUID REFERENCES leads(id),
    
    -- Question 1: Website
    has_website BOOLEAN,
    website_satisfaction INTEGER CHECK (website_satisfaction BETWEEN 1 AND 5),
    
    -- Question 2: Webshop
    webshop_status TEXT, -- Yes, No, Planned
    
    -- Question 3: IT Stack
    it_management TEXT, -- in-house, agency, freelancer, not sure
    
    -- Question 4: AI Usage
    ai_usage TEXT, -- None, Internal, Chatbot, Both
    
    -- Question 5: Priority
    top_priority TEXT,
    top_priority_other TEXT,

    -- Collector Info
    contact_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    consent_accepted BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Newsletter Signups table
CREATE TABLE IF NOT EXISTS newsletter_signups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    pharmacy_name TEXT,
    lead_id UUID REFERENCES leads(id),
    consent_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices for CRM performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_survey_responses_lead_id ON survey_responses(lead_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_signups_email ON newsletter_signups(email);
