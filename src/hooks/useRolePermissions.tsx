import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type AppRole = 'gestor' | 'comercial' | 'usuario';
type PermissionLevel = 'none' | 'view' | 'edit';

interface RolePermission {
  id: string;
  role: AppRole;
  category: string;
  permission_name: string;
  permission_level: PermissionLevel;
}

export const useRolePermissions = () => {
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*')
        .order('role', { ascending: true })
        .order('category', { ascending: true });

      if (error) throw error;
      setPermissions(data || []);
    } catch (error) {
      console.error('Error loading permissions:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as permissões',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePermission = async (
    role: AppRole,
    category: string,
    permissionName: string,
    newLevel: PermissionLevel
  ) => {
    try {
      const { error } = await supabase
        .from('role_permissions')
        .update({ permission_level: newLevel })
        .eq('role', role)
        .eq('category', category)
        .eq('permission_name', permissionName);

      if (error) throw error;

      // Update local state
      setPermissions((prev) =>
        prev.map((p) =>
          p.role === role &&
          p.category === category &&
          p.permission_name === permissionName
            ? { ...p, permission_level: newLevel }
            : p
        )
      );

      toast({
        title: 'Permissão atualizada',
        description: `Permissão de ${role} atualizada com sucesso`,
      });
    } catch (error) {
      console.error('Error updating permission:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a permissão',
        variant: 'destructive',
      });
    }
  };

  const getPermissionsByRole = (role: AppRole) => {
    return permissions.filter((p) => p.role === role);
  };

  return {
    permissions,
    loading,
    updatePermission,
    getPermissionsByRole,
  };
};
