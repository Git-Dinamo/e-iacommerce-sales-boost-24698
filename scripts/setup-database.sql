-- ========================================
-- SETUP COMPLETO DO BANCO DE DADOS
-- Execute este script no SQL Editor do Supabase
-- ========================================

-- 1. CREATE PROJECTS TABLE
-- ========================================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  client_name text,
  status text not null default 'active' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_accessed_at timestamptz not null default now()
);

-- Enable RLS on projects
alter table public.projects enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view their own projects" on public.projects;
drop policy if exists "Users can create their own projects" on public.projects;
drop policy if exists "Users can update their own projects" on public.projects;
drop policy if exists "Users can delete their own projects" on public.projects;

-- Create policies for projects
create policy "Users can view their own projects"
  on public.projects for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their own projects"
  on public.projects for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.projects for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on public.projects for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create indexes for performance
create index if not exists idx_projects_user_id on public.projects(user_id);
create index if not exists idx_projects_last_accessed on public.projects(last_accessed_at desc);

-- 2. CREATE CALCULATOR_DATA TABLE
-- ========================================
create table if not exists public.calculator_data (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null unique,
  
  -- Preços Comerciais
  preco_instalacao numeric default 0,
  preco_mensalidade numeric default 0,
  preco_consulta_simples numeric default 0,
  preco_consulta_retorno numeric default 0,
  preco_consulta_primeira_vez numeric default 0,
  
  -- Custos Internos
  custo_instalacao numeric default 0,
  custo_mensalidade numeric default 0,
  custo_consulta_simples numeric default 0,
  custo_consulta_retorno numeric default 0,
  custo_consulta_primeira_vez numeric default 0,
  
  -- Custos de Origem
  fonte_instalacao numeric default 0,
  fonte_mensalidade numeric default 0,
  fonte_consulta_simples numeric default 0,
  fonte_consulta_retorno numeric default 0,
  fonte_consulta_primeira_vez numeric default 0,
  
  -- Add-ons Recorrentes
  addons jsonb default '[]'::jsonb,
  
  -- Simulação de Contrato
  num_profissionais integer default 1,
  num_consultas_mes integer default 100,
  percentual_retorno numeric default 30,
  percentual_primeira_vez numeric default 70,
  duracao_meses integer default 12,
  complexidade text default 'baixa' check (complexidade in ('baixa', 'media', 'alta')),
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on calculator_data
alter table public.calculator_data enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view calculator data for their projects" on public.calculator_data;
drop policy if exists "Users can insert calculator data for their projects" on public.calculator_data;
drop policy if exists "Users can update calculator data for their projects" on public.calculator_data;
drop policy if exists "Users can delete calculator data for their projects" on public.calculator_data;

-- Create policies for calculator_data
create policy "Users can view calculator data for their projects"
  on public.calculator_data for select
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = calculator_data.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can insert calculator data for their projects"
  on public.calculator_data for insert
  to authenticated
  with check (
    exists (
      select 1 from public.projects
      where projects.id = calculator_data.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can update calculator data for their projects"
  on public.calculator_data for update
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = calculator_data.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can delete calculator data for their projects"
  on public.calculator_data for delete
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = calculator_data.project_id
      and projects.user_id = auth.uid()
    )
  );

-- Create index for performance
create index if not exists idx_calculator_data_project_id on public.calculator_data(project_id);

-- 3. CREATE TRIGGERS
-- ========================================
-- Function to auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Drop existing triggers if they exist
drop trigger if exists set_updated_at on public.projects;
drop trigger if exists set_calculator_updated_at on public.calculator_data;

-- Create triggers
create trigger set_updated_at
  before update on public.projects
  for each row
  execute function public.handle_updated_at();

create trigger set_calculator_updated_at
  before update on public.calculator_data
  for each row
  execute function public.handle_updated_at();

-- ========================================
-- SETUP COMPLETO!
-- ========================================
-- Agora você pode:
-- 1. Criar projetos
-- 2. Todas as alterações na calculadora serão persistidas
-- 3. Cada projeto tem sua própria calculadora isolada
