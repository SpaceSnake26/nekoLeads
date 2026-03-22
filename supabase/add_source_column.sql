-- Add source column to track lead origin
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'GMaps';

-- Index for source filtering
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
