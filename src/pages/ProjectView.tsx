import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Calculator } from '@/components/Calculator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Project {
  id: string;
  name: string;
  description: string | null;
  client_name: string | null;
  status: string;
}

const ProjectView = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;

      if (!data) {
        toast({
          title: 'Projeto não encontrado',
          description: 'O projeto que você está tentando acessar não existe',
          variant: 'destructive'
        });
        navigate('/');
        return;
      }

      setProject(data);

      // Atualizar last_accessed_at
      await supabase
        .from('projects')
        .update({ last_accessed_at: new Date().toISOString() })
        .eq('id', projectId);

    } catch (error: any) {
      toast({
        title: 'Erro ao carregar projeto',
        description: error.message,
        variant: 'destructive'
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
              {project.client_name && (
                <p className="text-sm text-muted-foreground">
                  Cliente: {project.client_name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Component */}
      <div className="container mx-auto px-4 pt-6 pb-8">
        {project.description && (
          <div className="mb-6 bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>
        )}

        <Calculator projectId={projectId!} />
      </div>
    </div>
  );
};

export default ProjectView;
