import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PermissionToggle from '@/components/PermissionToggle';

type AppRole = 'gestor' | 'comercial' | 'usuario';
type PermissionLevel = 'none' | 'view' | 'edit';

interface RoleConfig {
  role: AppRole;
  label: string;
  description: string;
}

const categoryMapping: Record<string, string> = {
  precificacao_comercial: 'Precificação Comercial',
  custos_internos: 'Custos Internos',
  custos_fonte: 'Custos Fonte',
  simulacoes: 'Simulações',
};

const permissionNameMapping: Record<string, string> = {
  visualizar_valores: 'Visualizar valores',
  editar_valores: 'Editar valores',
  visualizar_custos: 'Visualizar custos',
  visualizar_simulacoes: 'Visualizar simulações',
  criar_editar_simulacoes: 'Criar/editar simulações',
};

const RolesManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isGestor, loading, userRoles } = usePermissions();
  const { permissions, loading: permissionsLoading, updatePermission, getPermissionsByRole } = useRolePermissions();

  useEffect(() => {
    if (!loading && !isGestor) {
      toast({
        title: "Acesso negado",
        description: "Apenas gestores podem acessar esta página.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isGestor, loading, navigate]);

  const rolesConfig: RoleConfig[] = [
    {
      role: 'gestor',
      label: 'Gestor',
      description: 'Acesso completo ao sistema com permissões de edição em todas as áreas',
    },
    {
      role: 'comercial',
      label: 'Comercial',
      description: 'Acesso de visualização aos custos e edição de simulações',
    },
    {
      role: 'usuario',
      label: 'Usuário',
      description: 'Acesso básico ao sistema',
    }
  ];

  const groupPermissionsByCategory = (rolePerms: any[]) => {
    const grouped: Record<string, any[]> = {};
    rolePerms.forEach((perm) => {
      if (!grouped[perm.category]) {
        grouped[perm.category] = [];
      }
      grouped[perm.category].push(perm);
    });
    return grouped;
  };

  if (loading || permissionsLoading || !isGestor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              Gerenciamento de Roles e Permissões
            </h1>
            <p className="text-gray-600 mt-1">
              Configure as permissões de cada perfil de usuário no sistema
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-gray-600">Sua role atual:</span>
              {userRoles && userRoles.length > 0 ? (
                userRoles.map((r) => (
                  <Badge key={r} variant="secondary">{r}</Badge>
                ))
              ) : (
                <Badge variant="outline">sem role</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {rolesConfig.map((roleConfig) => {
            const rolePerms = getPermissionsByRole(roleConfig.role);
            const groupedPerms = groupPermissionsByCategory(rolePerms);

            return (
              <Card key={roleConfig.role} className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{roleConfig.label}</CardTitle>
                    <Badge variant="secondary" className="bg-white text-blue-600">
                      {roleConfig.role}
                    </Badge>
                  </div>
                  <CardDescription className="text-blue-50">
                    {roleConfig.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-4 space-y-4">
                  {Object.entries(groupedPerms).map(([category, perms]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="font-semibold text-gray-700 border-b pb-1">
                        {categoryMapping[category] || category}
                      </h3>
                      <div className="space-y-2">
                        {perms.map((perm) => (
                          <div
                            key={perm.id}
                            className="flex items-center justify-between text-sm p-2 rounded bg-gray-50"
                          >
                            <span className="text-gray-700">
                              {permissionNameMapping[perm.permission_name] || perm.permission_name}
                            </span>
                            <PermissionToggle
                              level={perm.permission_level}
                              onChange={(newLevel) =>
                                updatePermission(
                                  roleConfig.role,
                                  category,
                                  perm.permission_name,
                                  newLevel
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle>📋 Resumo de Permissões</CardTitle>
            <CardDescription>
              Entenda como cada role funciona no sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">🔑 Gestor</h4>
              <p className="text-sm text-blue-800">
                Possui acesso completo ao sistema. Pode visualizar e editar todos os valores de custos
                internos, custos fonte e simulações. Ideal para administradores e diretores.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">💼 Comercial</h4>
              <p className="text-sm text-green-800">
                Pode visualizar custos internos e custos fonte (sem poder editar), mas tem permissão
                para criar e editar simulações. Ideal para equipe de vendas e propostas comerciais.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">👤 Usuário</h4>
              <p className="text-sm text-gray-800">
                Acesso básico ao sistema. Pode precisar de permissões específicas atribuídas pelo gestor
                para realizar ações no sistema.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RolesManagement;
