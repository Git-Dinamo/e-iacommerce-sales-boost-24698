-- Adicionar coluna para armazenar entregáveis comerciais
ALTER TABLE public.calculator_data 
ADD COLUMN IF NOT EXISTS entregaveis_comerciais jsonb DEFAULT '[]'::jsonb;