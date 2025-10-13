-- Migration: Create Projects/Files System
-- Created: 2025-10-13
-- Purpose: Sistema de gerenciamento de ficheiros/projetos de calculadoras

-- Tabela de Projetos (Ficheiros)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  client_name TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de Dados da Calculadora
CREATE TABLE IF NOT EXISTS public.calculator_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,

  -- Dados de Implantação
  impl_agente NUMERIC DEFAULT 3800,
  impl_lembretes NUMERIC DEFAULT 5500,
  impl_paineis NUMERIC DEFAULT 4200,
  impl_integracao NUMERIC DEFAULT 8000,
  impl_setup NUMERIC DEFAULT 6500,
  impl_treinamento NUMERIC DEFAULT 3500,

  -- Dados de Recorrência
  rec_manutencao NUMERIC DEFAULT 8000,
  rec_infra NUMERIC DEFAULT 3500,
  rec_suporte NUMERIC DEFAULT 4500,

  -- Simulação
  sim_desconto_global NUMERIC DEFAULT 0,
  sim_prazo_contrato NUMERIC DEFAULT 12,
  sim_distribuicao_pagamento NUMERIC DEFAULT 0,

  -- Observações
  observacoes JSONB DEFAULT '[]'::jsonb,

  -- Custos Fonte
  custos_fonte JSONB DEFAULT '{
    "recursosHumanos": {
      "devPleno": 10000,
      "devSenior": 15000,
      "pmJunior": 6000
    },
    "infraestrutura": {
      "servidorApi": 300,
      "servidorDb": 200,
      "servidorIA": 500,
      "cdnStorage": 30
    }
  }'::jsonb,

  -- Adicionais
  adicionais JSONB DEFAULT '[]'::jsonb,

  -- Complexidades
  complexidades JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  UNIQUE(project_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON public.projects(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_last_accessed ON public.projects(last_accessed_at DESC);
CREATE INDEX IF NOT EXISTS idx_calculator_data_project_id ON public.calculator_data(project_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calculator_data_updated_at
  BEFORE UPDATE ON public.calculator_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculator_data ENABLE ROW LEVEL SECURITY;

-- Policies: Acesso público (sem autenticação)
-- Como não há sistema de auth, todos têm acesso a tudo
CREATE POLICY "Allow public access to projects"
ON public.projects
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public access to calculator_data"
ON public.calculator_data
FOR ALL
USING (true)
WITH CHECK (true);

-- Inserir projeto de exemplo
INSERT INTO public.projects (name, description, client_name, status)
VALUES
  ('Projeto Exemplo', 'Calculadora de exemplo para demonstração', 'Cliente Demo', 'active')
ON CONFLICT DO NOTHING;

-- Comentários para documentação
COMMENT ON TABLE public.projects IS 'Armazena os projetos/ficheiros de calculadoras';
COMMENT ON TABLE public.calculator_data IS 'Armazena os dados de cada calculadora associada a um projeto';
COMMENT ON COLUMN public.projects.status IS 'Status do projeto: draft (rascunho), active (ativo), archived (arquivado)';
COMMENT ON COLUMN public.projects.last_accessed_at IS 'Última vez que o projeto foi acessado/visualizado';
