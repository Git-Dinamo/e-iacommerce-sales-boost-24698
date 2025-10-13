import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Plus, FolderOpen, Search, Calendar, FileText, Trash2, Archive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Project {
  id: string;
  name: string;
  description: string | null;
  client_name: string | null;
  status: 'draft' | 'active' | 'archived';
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Novo projeto form
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    client_name: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    // Filtrar projetos baseado no termo de busca
    if (searchTerm) {
      const filtered = projects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }, [searchTerm, projects]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('last_accessed_at', { ascending: false });

      if (error) throw error;

      setProjects(data || []);
      setFilteredProjects(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar projetos',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!newProject.name.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Por favor, insira um nome para o projeto',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Criar projeto
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: newProject.name,
          description: newProject.description || null,
          client_name: newProject.client_name || null,
          status: 'active'
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Criar dados da calculadora com valores padrão
      const { error: calcError } = await supabase
        .from('calculator_data')
        .insert({
          project_id: project.id
        });

      if (calcError) throw calcError;

      toast({
        title: 'Projeto criado!',
        description: `"${newProject.name}" foi criado com sucesso`
      });

      // Resetar form e fechar dialog
      setNewProject({ name: '', description: '', client_name: '' });
      setIsDialogOpen(false);

      // Recarregar lista
      loadProjects();

      // Navegar para o projeto
      navigate(`/project/${project.id}`);

    } catch (error: any) {
      toast({
        title: 'Erro ao criar projeto',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const deleteProject = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${name}"?`)) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Projeto excluído',
        description: `"${name}" foi excluído com sucesso`
      });

      loadProjects();
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir projeto',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const archiveProject = async (id: string, name: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'archived' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Projeto arquivado',
        description: `"${name}" foi arquivado`
      });

      loadProjects();
    } catch (error: any) {
      toast({
        title: 'Erro ao arquivar projeto',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const openProject = async (id: string) => {
    // Atualizar last_accessed_at
    await supabase
      .from('projects')
      .update({ last_accessed_at: new Date().toISOString() })
      .eq('id', id);

    navigate(`/project/${id}`);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      draft: { variant: 'outline', label: 'Rascunho' },
      active: { variant: 'default', label: 'Ativo' },
      archived: { variant: 'secondary', label: 'Arquivado' }
    };

    const config = variants[status] || variants.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            📁 Gerenciador de Projetos
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas calculadoras e propostas comerciais
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nome, cliente ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Projeto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Projeto</DialogTitle>
                <DialogDescription>
                  Crie um novo projeto de calculadora para um cliente
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Projeto *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Proposta Clínica XYZ"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client">Nome do Cliente</Label>
                  <Input
                    id="client"
                    placeholder="Ex: Clínica São Paulo"
                    value={newProject.client_name}
                    onChange={(e) => setNewProject({ ...newProject, client_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o projeto..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={createProject}>
                  Criar Projeto
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando projetos...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm ? 'Nenhum projeto encontrado' : 'Nenhum projeto ainda'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? 'Tente buscar por outro termo'
                  : 'Crie seu primeiro projeto para começar'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Criar Primeiro Projeto
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => openProject(project.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <FileText className="h-8 w-8 text-primary" />
                    {getStatusBadge(project.status)}
                  </div>
                  <CardTitle className="mt-4 group-hover:text-primary transition-colors">
                    {project.name}
                  </CardTitle>
                  {project.client_name && (
                    <CardDescription>
                      Cliente: {project.client_name}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {project.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(project.last_accessed_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        archiveProject(project.id, project.name);
                      }}
                      className="flex-1"
                    >
                      <Archive className="h-3 w-3 mr-1" />
                      Arquivar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project.id, project.name);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
