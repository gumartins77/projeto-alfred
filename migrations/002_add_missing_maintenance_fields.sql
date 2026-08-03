-- Migration 002: Add missing fields to match the physical form (Boletim de Manutenção - Componentes de Fixação)

-- Add client and report information fields to maintenance_reports
ALTER TABLE maintenance_reports 
ADD COLUMN report_number VARCHAR(50),
ADD COLUMN report_type VARCHAR(20) DEFAULT 'rotina' CHECK (report_type IN ('rotina', 'chamado')),
ADD COLUMN client_name VARCHAR(255),
ADD COLUMN client_address VARCHAR(255),
ADD COLUMN client_city VARCHAR(100),
ADD COLUMN client_phone VARCHAR(50),
ADD COLUMN client_contact VARCHAR(255),
ADD COLUMN client_state VARCHAR(2),
ADD COLUMN function_description VARCHAR(255),
ADD COLUMN service_area VARCHAR(255),
ADD COLUMN technical_signature TEXT,
ADD COLUMN client_signature TEXT,
ADD COLUMN responsible_signature TEXT;

-- Create maintenance_report_parts table for parts to be replaced / replaced
CREATE TABLE IF NOT EXISTS maintenance_report_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES maintenance_reports(id) ON DELETE CASCADE,
  list_number SMALLINT NOT NULL CHECK (list_number IN (1, 2)),
  -- 1 = "Peças a serem substituídas"
  -- 2 = "Peças substituídas"
  machine_number VARCHAR(255),
  fig VARCHAR(50),
  item VARCHAR(50),
  quantity NUMERIC,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_maintenance_report_parts_report_id 
  ON maintenance_report_parts(report_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_report_parts_list_number 
  ON maintenance_report_parts(report_id, list_number);

-- Enable Row Level Security (RLS) for maintenance_report_parts
ALTER TABLE maintenance_report_parts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for maintenance_report_parts
CREATE POLICY "Users can manage parts of their own reports"
  ON maintenance_report_parts
  FOR ALL
  USING (report_id IN (SELECT id FROM maintenance_reports WHERE user_id = auth.uid()))
  WITH CHECK (report_id IN (SELECT id FROM maintenance_reports WHERE user_id = auth.uid()));

-- Create trigger to update updated_at for maintenance_report_parts
CREATE TRIGGER update_maintenance_report_parts_updated_at
  BEFORE UPDATE ON maintenance_report_parts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
