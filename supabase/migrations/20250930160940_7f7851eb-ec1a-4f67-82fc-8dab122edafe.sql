-- Create enum for permission levels
CREATE TYPE public.permission_level AS ENUM ('none', 'view', 'edit');

-- Create table to store role permissions configuration
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  category TEXT NOT NULL,
  permission_name TEXT NOT NULL,
  permission_level permission_level NOT NULL DEFAULT 'none',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(role, category, permission_name)
);

-- Enable RLS
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Policy: Gestor can manage all role permissions
CREATE POLICY "Gestor can manage role permissions"
ON public.role_permissions
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'gestor'::app_role))
WITH CHECK (has_role(auth.uid(), 'gestor'::app_role));

-- Policy: Users can view role permissions
CREATE POLICY "Users can view role permissions"
ON public.role_permissions
FOR SELECT
TO authenticated
USING (true);

-- Trigger to update updated_at
CREATE TRIGGER set_role_permissions_updated_at
BEFORE UPDATE ON public.role_permissions
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Insert default permissions for gestor
INSERT INTO public.role_permissions (role, category, permission_name, permission_level) VALUES
('gestor', 'precificacao_comercial', 'visualizar_valores', 'edit'),
('gestor', 'precificacao_comercial', 'editar_valores', 'edit'),
('gestor', 'custos_internos', 'visualizar_custos', 'edit'),
('gestor', 'custos_internos', 'editar_valores', 'edit'),
('gestor', 'custos_fonte', 'visualizar_custos', 'edit'),
('gestor', 'custos_fonte', 'editar_valores', 'edit'),
('gestor', 'simulacoes', 'visualizar_simulacoes', 'edit'),
('gestor', 'simulacoes', 'criar_editar_simulacoes', 'edit');

-- Insert default permissions for comercial
INSERT INTO public.role_permissions (role, category, permission_name, permission_level) VALUES
('comercial', 'precificacao_comercial', 'visualizar_valores', 'view'),
('comercial', 'precificacao_comercial', 'editar_valores', 'none'),
('comercial', 'custos_internos', 'visualizar_custos', 'view'),
('comercial', 'custos_internos', 'editar_valores', 'none'),
('comercial', 'custos_fonte', 'visualizar_custos', 'view'),
('comercial', 'custos_fonte', 'editar_valores', 'none'),
('comercial', 'simulacoes', 'visualizar_simulacoes', 'edit'),
('comercial', 'simulacoes', 'criar_editar_simulacoes', 'edit');

-- Insert default permissions for usuario
INSERT INTO public.role_permissions (role, category, permission_name, permission_level) VALUES
('usuario', 'precificacao_comercial', 'visualizar_valores', 'none'),
('usuario', 'precificacao_comercial', 'editar_valores', 'none'),
('usuario', 'custos_internos', 'visualizar_custos', 'none'),
('usuario', 'custos_internos', 'editar_valores', 'none'),
('usuario', 'custos_fonte', 'visualizar_custos', 'none'),
('usuario', 'custos_fonte', 'editar_valores', 'none'),
('usuario', 'simulacoes', 'visualizar_simulacoes', 'none'),
('usuario', 'simulacoes', 'criar_editar_simulacoes', 'none');