import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

type AppRole = 'gestor' | 'comercial' | 'usuario';

interface Permission {
  canEditCustosInternos: boolean;
  canEditCustosFonte: boolean;
  canEditSimulacao: boolean;
  canViewCustosInternos: boolean;
  canViewCustosFonte: boolean;
}

export const usePermissions = () => {
  const { user, loading: authLoading } = useAuth();
  const [userRoles, setUserRoles] = useState<AppRole[]>([]);
  const [permissions, setPermissions] = useState<Permission>({
    canEditCustosInternos: false,
    canEditCustosFonte: false,
    canEditSimulacao: false,
    canViewCustosInternos: false,
    canViewCustosFonte: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      console.log('[usePermissions] Auth still loading, waiting before resolving permissions');
      setLoading(true);
      return;
    }

    if (user) {
      loadUserRoles();
    } else {
      console.log('[usePermissions] No user after auth resolved, setting default (visitor) permissions');
      setLoading(false);
      setUserRoles([]);
      setPermissions({
        canEditCustosInternos: false,
        canEditCustosFonte: false,
        canEditSimulacao: false,
        canViewCustosInternos: false,
        canViewCustosFonte: false,
      });
    }
  }, [user, authLoading]);

  const loadUserRoles = async () => {
    if (!user) {
      console.log('[usePermissions] No user found');
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log('[usePermissions] Loading roles for user:', user.id);

    try {
      // Load user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      console.log('[usePermissions] Query result:', { data: rolesData, error: rolesError });

      if (rolesError) {
        console.error('[usePermissions] Error loading roles:', rolesError);
        throw rolesError;
      }

      const roles = rolesData?.map((r: any) => r.role as AppRole) || [];
      console.log('[usePermissions] Loaded roles:', roles);
      
      // Se não tiver nenhuma role, adiciona como 'usuario' por padrão
      if (roles.length === 0) {
        console.log('[usePermissions] No roles found, adding default "usuario" role');
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ user_id: user.id, role: 'usuario' });
        
        if (insertError) {
          console.error('[usePermissions] Error inserting default role:', insertError);
        } else {
          roles.push('usuario');
        }
      }

      setUserRoles(roles);
      await calculatePermissions(roles);
    } catch (error) {
      console.error('[usePermissions] Fatal error loading user roles:', error);
      // Em caso de erro, define como usuario por segurança
      setUserRoles(['usuario']);
      await calculatePermissions(['usuario']);
    } finally {
      setLoading(false);
    }
  };

  const calculatePermissions = async (roles: AppRole[]) => {
    console.log('[usePermissions] Calculating permissions for roles:', roles);

    try {
      // Load permissions from database for user's roles
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*')
        .in('role', roles);

      if (error) {
        console.error('[usePermissions] Error loading role permissions:', error);
        throw error;
      }

      console.log('[usePermissions] Role permissions from DB:', data);

      // Calculate permissions based on the highest level across all roles
      const hasEditCustosInternos = data?.some(
        (p) => p.category === 'custos_internos' && p.permission_name === 'editar_valores' && p.permission_level === 'edit'
      );
      const hasViewCustosInternos = data?.some(
        (p) => p.category === 'custos_internos' && p.permission_name === 'visualizar_custos' && ['view', 'edit'].includes(p.permission_level)
      );
      const hasEditCustosFonte = data?.some(
        (p) => p.category === 'custos_fonte' && p.permission_name === 'editar_valores' && p.permission_level === 'edit'
      );
      const hasViewCustosFonte = data?.some(
        (p) => p.category === 'custos_fonte' && p.permission_name === 'visualizar_custos' && ['view', 'edit'].includes(p.permission_level)
      );
      const hasEditSimulacao = data?.some(
        (p) => p.category === 'simulacoes' && p.permission_name === 'criar_editar_simulacoes' && p.permission_level === 'edit'
      );

      const newPermissions = {
        canEditCustosInternos: hasEditCustosInternos || false,
        canEditCustosFonte: hasEditCustosFonte || false,
        canEditSimulacao: hasEditSimulacao || false,
        canViewCustosInternos: hasViewCustosInternos || false,
        canViewCustosFonte: hasViewCustosFonte || false,
      };

      console.log('[usePermissions] Calculated permissions:', newPermissions);
      setPermissions(newPermissions);
    } catch (error) {
      console.error('[usePermissions] Error calculating permissions:', error);
      // Fallback to no permissions
      setPermissions({
        canEditCustosInternos: false,
        canEditCustosFonte: false,
        canEditSimulacao: false,
        canViewCustosInternos: false,
        canViewCustosFonte: false,
      });
    }
  };

  const hasRole = (role: AppRole) => {
    return userRoles.includes(role);
  };

  return {
    userRoles,
    permissions,
    loading,
    hasRole,
    isGestor: userRoles.includes('gestor'),
    isComercial: userRoles.includes('comercial'),
    isUsuario: userRoles.includes('usuario'),
  };
};
