-- Adicionar coluna para prazo de implantação
ALTER TABLE calculator_data 
ADD COLUMN IF NOT EXISTS prazo_implantacao integer DEFAULT 3;