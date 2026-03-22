-- Create sequence for simple invoice numbers if needed
-- CREATE SEQUENCE IF NOT EXISTS invoice_seq START 1000;

-- 1. Projects Board (`erp_projects`)
CREATE TABLE IF NOT EXISTS erp_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    client TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Website' | 'Webshop' | 'AI Tool' | 'Other'
    assignee TEXT, -- 'Owner' | 'Fabs' | 'Brother'
    priority TEXT DEFAULT 'Medium', -- 'Low' | 'Medium' | 'High' | 'Urgent'
    value_chf NUMERIC DEFAULT 0.00,
    due_date DATE,
    status TEXT DEFAULT 'Backlog', -- 'Backlog' | 'In Progress' | 'Review' | 'Waiting Client' | 'Done'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Expenses Tracker (`erp_expenses`)
CREATE TABLE IF NOT EXISTS erp_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Software' | 'Hardware' | 'Marketing' | 'Freelancer' | 'Other'
    amount_chf NUMERIC NOT NULL,
    project_id UUID REFERENCES erp_projects(id) ON DELETE SET NULL,
    paid_by TEXT NOT NULL, -- 'Owner' | 'Fabs' | 'Brother'
    has_receipt BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Invoices (`erp_invoices`)
CREATE TABLE IF NOT EXISTS erp_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT NOT NULL,
    client TEXT NOT NULL,
    project_id UUID REFERENCES erp_projects(id) ON DELETE SET NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    amount_chf NUMERIC NOT NULL,
    status TEXT DEFAULT 'Draft', -- 'Draft' | 'Sent' | 'Paid' | 'Overdue'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable Row Level Security since it's an internal tool as requested
ALTER TABLE erp_projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE erp_expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE erp_invoices DISABLE ROW LEVEL SECURITY;
