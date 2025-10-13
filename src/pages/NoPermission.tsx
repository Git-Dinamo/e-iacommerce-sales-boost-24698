import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldOff, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const NoPermission = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-red-500 to-orange-600 text-white text-center">
          <div className="flex justify-center mb-4">
            <ShieldOff className="w-20 h-20" />
          </div>
          <CardTitle className="text-3xl font-bold">Acesso Negado</CardTitle>
          <CardDescription className="text-red-50 text-lg">
            Você não tem permissão para acessar este sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6 space-y-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <p className="text-red-800 font-medium">
              Seu usuário não possui as permissões necessárias para visualizar este conteúdo.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 text-lg">O que você pode fazer:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>Entre em contato com um gestor do sistema para solicitar acesso</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>Verifique se você está usando a conta correta</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>Caso seja um novo usuário, aguarde a atribuição de permissões</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">Informação sobre Permissões</h4>
            <p className="text-sm text-blue-800">
              Este sistema possui diferentes níveis de acesso (Gestor, Comercial, Usuário). 
              Para obter acesso completo, você precisa ser promovido por um gestor existente através da tela de gerenciamento de roles.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="default"
              onClick={() => navigate('/')}
              className="flex-1 gap-2"
            >
              <Home className="w-4 h-4" />
              Ir para Início
            </Button>
            <Button
              variant="outline"
              onClick={signOut}
              className="flex-1 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Fazer Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoPermission;
