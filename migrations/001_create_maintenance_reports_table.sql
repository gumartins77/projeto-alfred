-- Create the maintenance_reports table
CREATE TABLE IF NOT EXISTS maintenance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  machine_number VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location VARCHAR(255) NOT NULL,
  responsible VARCHAR(255) NOT NULL,
  observations TEXT,
  line_items JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_maintenance_reports_user_id ON maintenance_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_reports_date ON maintenance_reports(date);
CREATE INDEX IF NOT EXISTS idx_maintenance_reports_created_at ON maintenance_reports(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE maintenance_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own reports
CREATE POLICY "Users can view their own reports" 
  ON maintenance_reports 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can create reports
CREATE POLICY "Users can create reports" 
  ON maintenance_reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reports
CREATE POLICY "Users can update their own reports" 
  ON maintenance_reports 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reports
CREATE POLICY "Users can delete their own reports" 
  ON maintenance_reports 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_maintenance_reports_updated_at
  BEFORE UPDATE ON maintenance_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
