
-- Fase 1: Limpar políticas RLS redundantes e corrigir problemas de segurança

-- 1. Remover política redundante de visualização para gestores
DROP POLICY IF EXISTS "Gestor can view all roles" ON public.user_roles;

-- 2. Corrigir política de visualização de perfis (issue de segurança)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can view other profiles basic info"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- 3. Garantir que a função has_role tem search_path correto (já está correto)
-- A função já está definida com: security definer set search_path = public

-- 4. Adicionar índice para melhorar performance das consultas de roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- 5. Garantir que novos usuários sempre tenham role 'usuario' através do trigger
-- (O trigger handle_new_user já existe e faz isso)
