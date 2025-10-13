-- Script para atualizar legolas@dinamopro.com para gestor
-- Execute este script no Supabase Dashboard > SQL Editor

-- Passo 1: Verificar se o usuário existe
SELECT
  u.id,
  u.email,
  u.created_at as user_created_at,
  p.full_name,
  ur.role as current_role
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.email = 'legolas@dinamopro.com';

-- Passo 2: Atualizar para gestor
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Buscar user_id
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'legolas@dinamopro.com';

  IF v_user_id IS NOT NULL THEN
    -- Criar profile se não existir
    INSERT INTO public.profiles (id, full_name, created_at, updated_at)
    VALUES (v_user_id, 'Legolas', now(), now())
    ON CONFLICT (id) DO UPDATE
    SET updated_at = now();

    -- Remover role existente
    DELETE FROM public.user_roles WHERE user_id = v_user_id;

    -- Adicionar role gestor
    INSERT INTO public.user_roles (user_id, role, created_at)
    VALUES (v_user_id, 'gestor', now());

    RAISE NOTICE 'Usuário atualizado com sucesso para gestor!';
  ELSE
    RAISE WARNING 'Usuário legolas@dinamopro.com não encontrado. Faça login primeiro via OAuth.';
  END IF;
END $$;

-- Passo 3: Verificar a atualização
SELECT
  u.id,
  u.email,
  p.full_name,
  ur.role as new_role,
  ur.created_at as role_assigned_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.email = 'legolas@dinamopro.com';
