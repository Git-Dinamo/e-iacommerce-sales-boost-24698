-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  client_name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Users can view their own projects"
  ON public.projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_last_accessed ON public.projects(last_accessed_at DESC);

-- Create calculator_data table
CREATE TABLE IF NOT EXISTS public.calculator_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Preços Comerciais
  preco_instalacao NUMERIC DEFAULT 0,
  preco_mensalidade NUMERIC DEFAULT 0,
  preco_consulta_simples NUMERIC DEFAULT 0,
  preco_consulta_retorno NUMERIC DEFAULT 0,
  preco_consulta_primeira_vez NUMERIC DEFAULT 0,
  
  -- Custos Internos
  custo_instalacao NUMERIC DEFAULT 0,
  custo_mensalidade NUMERIC DEFAULT 0,
  custo_consulta_simples NUMERIC DEFAULT 0,
  custo_consulta_retorno NUMERIC DEFAULT 0,
  custo_consulta_primeira_vez NUMERIC DEFAULT 0,
  
  -- Custos de Origem
  fonte_instalacao NUMERIC DEFAULT 0,
  fonte_mensalidade NUMERIC DEFAULT 0,
  fonte_consulta_simples NUMERIC DEFAULT 0,
  fonte_consulta_retorno NUMERIC DEFAULT 0,
  fonte_consulta_primeira_vez NUMERIC DEFAULT 0,
  
  -- Add-ons Recorrentes
  addons JSONB DEFAULT '[]'::jsonb,
  
  -- Simulação de Contrato
  num_profissionais INTEGER DEFAULT 1,
  num_consultas_mes INTEGER DEFAULT 100,
  percentual_retorno NUMERIC DEFAULT 30,
  percentual_primeira_vez NUMERIC DEFAULT 70,
  duracao_meses INTEGER DEFAULT 12,
  complexidade TEXT DEFAULT 'baixa' CHECK (complexidade IN ('baixa', 'media', 'alta')),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on calculator_data
ALTER TABLE public.calculator_data ENABLE ROW LEVEL SECURITY;

-- Create policies for calculator_data
CREATE POLICY "Users can view calculator data for their projects"
  ON public.calculator_data FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = calculator_data.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert calculator data for their projects"
  ON public.calculator_data FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = calculator_data.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update calculator data for their projects"
  ON public.calculator_data FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = calculator_data.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete calculator data for their projects"
  ON public.calculator_data FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = calculator_data.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_calculator_data_project_id ON public.calculator_data(project_id);

-- Create trigger for auto-updating updated_at
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_calculator_updated_at
  BEFORE UPDATE ON public.calculator_data
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();