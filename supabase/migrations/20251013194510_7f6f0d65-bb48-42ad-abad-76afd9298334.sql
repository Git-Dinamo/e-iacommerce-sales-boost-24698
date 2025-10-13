-- Tornar user_id nullable para permitir projetos anônimos
ALTER TABLE public.projects ALTER COLUMN user_id DROP NOT NULL;

-- Remover políticas antigas que exigem autenticação
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

DROP POLICY IF EXISTS "Users can view calculator data for their projects" ON public.calculator_data;
DROP POLICY IF EXISTS "Users can insert calculator data for their projects" ON public.calculator_data;
DROP POLICY IF EXISTS "Users can update calculator data for their projects" ON public.calculator_data;
DROP POLICY IF EXISTS "Users can delete calculator data for their projects" ON public.calculator_data;

-- Criar políticas que permitem acesso público aos projetos
CREATE POLICY "Anyone can view projects"
  ON public.projects FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create projects"
  ON public.projects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update projects"
  ON public.projects FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete projects"
  ON public.projects FOR DELETE
  USING (true);

-- Criar políticas públicas para calculator_data
CREATE POLICY "Anyone can view calculator data"
  ON public.calculator_data FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert calculator data"
  ON public.calculator_data FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update calculator data"
  ON public.calculator_data FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete calculator data"
  ON public.calculator_data FOR DELETE
  USING (true);