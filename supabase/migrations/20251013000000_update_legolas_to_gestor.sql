-- Migration: Update legolas@dinamopro.com to gestor role
-- Created: 2025-10-13
-- Purpose: Grant full permissions (gestor role) to legolas@dinamopro.com

-- First, find the user_id for legolas@dinamopro.com
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get user_id from auth.users based on email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'legolas@dinamopro.com';

  IF v_user_id IS NOT NULL THEN
    -- Check if profile exists, if not create it
    INSERT INTO public.profiles (id, full_name, created_at, updated_at)
    VALUES (v_user_id, 'Legolas', now(), now())
    ON CONFLICT (id) DO NOTHING;

    -- Delete existing role for this user if any
    DELETE FROM public.user_roles WHERE user_id = v_user_id;

    -- Insert gestor role
    INSERT INTO public.user_roles (user_id, role, created_at)
    VALUES (v_user_id, 'gestor'::app_role, now());

    RAISE NOTICE 'Successfully updated user legolas@dinamopro.com to gestor role';
  ELSE
    RAISE NOTICE 'User legolas@dinamopro.com not found in auth.users. Please login first to create the auth user.';
  END IF;
END $$;
