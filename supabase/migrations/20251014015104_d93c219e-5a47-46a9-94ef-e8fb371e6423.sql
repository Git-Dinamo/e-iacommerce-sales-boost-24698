-- Adicionar coluna para armazenar custos fonte
ALTER TABLE public.calculator_data 
ADD COLUMN IF NOT EXISTS custos_fonte jsonb DEFAULT '{"implantacao": [], "mensaisFixos": []}'::jsonb;