-- Migration 003: Add service metadata fields to maintenance_reports

ALTER TABLE maintenance_reports
  ADD COLUMN IF NOT EXISTS produto VARCHAR(255),
  ADD COLUMN IF NOT EXISTS ordem_producao VARCHAR(255),
  ADD COLUMN IF NOT EXISTS ordem_venda VARCHAR(255),
  ADD COLUMN IF NOT EXISTS lote VARCHAR(255);
