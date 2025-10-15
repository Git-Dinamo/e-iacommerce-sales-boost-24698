import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Download, Loader2 } from "lucide-react";

interface ExecutiveSummaryExporterProps {
  projectId: string;
  projectName: string;
  clientName: string;
  custosFonte: any;
  entregaveisComerciais: any[];
  totals: any;
  simuladorContrato: any;
  prazoContrato: number;
}

export const ExecutiveSummaryExporter = ({
  projectId,
  projectName: defaultProjectName,
  clientName: defaultClientName,
  custosFonte,
  entregaveisComerciais,
  totals,
  simuladorContrato,
  prazoContrato
}: ExecutiveSummaryExporterProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState(defaultProjectName);
  const [clientName, setClientName] = useState(defaultClientName);
  const { toast } = useToast();

  // Buscar dados do projeto
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('name, client_name')
          .eq('id', projectId)
          .single();

        if (!error && data) {
          setProjectName(data.name || defaultProjectName);
          setClientName(data.client_name || defaultClientName);
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchProjectData();
  }, [projectId, defaultProjectName, defaultClientName]);

  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const generateExecutiveSummary = async () => {
    setIsGenerating(true);
    try {
      // Separar entregáveis por tipo
      const entregaveisImplantacao = entregaveisComerciais.filter(e => e.tipo === 'implantacao');
      const entregaveisMensal = entregaveisComerciais.filter(e => e.tipo === 'mensal');

      // Calcular totais
      const receitaImplantacao = entregaveisImplantacao.reduce((sum, e) => sum + (e.precoVenda * e.quantidade), 0);
      const receitaMensal = entregaveisMensal.reduce((sum, e) => sum + (e.precoVenda * e.quantidade), 0);
      
      const custoImplantacao = custosFonte.implantacao?.reduce((sum: number, c: any) => sum + c.valor, 0) || 0;
      const custoMensal = custosFonte.mensaisFixos?.reduce((sum: number, c: any) => sum + c.valor, 0) || 0;

      const margemImplantacao = receitaImplantacao > 0 
        ? ((receitaImplantacao - custoImplantacao) / receitaImplantacao) * 100 
        : 0;
      const margemRecorrencia = receitaMensal > 0 
        ? ((receitaMensal - custoMensal) / receitaMensal) * 100 
        : 0;

      const prazoMeses = prazoContrato || 12;
      const receitaTotalAnual = receitaImplantacao + (receitaMensal * prazoMeses);
      const custoTotalAnual = custoImplantacao + (custoMensal * prazoMeses);
      const margemLiquidaAnual = receitaTotalAnual > 0
        ? ((receitaTotalAnual - custoTotalAnual) / receitaTotalAnual) * 100
        : 0;

      const projectData = {
        projeto: {
          nome: projectName,
          cliente: clientName,
          descricao: `Análise financeira completa do projeto ${projectName}`
        },
        custosFonte: {
          implantacao: custosFonte.implantacao || [],
          mensaisFixos: custosFonte.mensaisFixos || []
        },
        entregaveisComerciais: {
          implantacao: entregaveisImplantacao,
          mensal: entregaveisMensal
        },
        totais: {
          receitaImplantacao,
          receitaMensal,
          custoImplantacao,
          custoMensal,
          margemImplantacao,
          margemRecorrencia,
          receitaTotalAnual,
          custoTotalAnual,
          margemLiquidaAnual
        },
        simulacao: {
          prazoContrato: prazoMeses,
          descontoGlobal: simuladorContrato?.descontoGlobal || 0
        }
      };

      console.log("Generating executive summary with data:", projectData);

      const { data, error } = await supabase.functions.invoke('generate-executive-summary', {
        body: { projectData }
      });

      if (error) {
        console.error("Error from edge function:", error);
        throw error;
      }

      if (!data?.html) {
        throw new Error("No HTML content received from AI");
      }

      setHtmlContent(data.html);
      setIsDialogOpen(true);

      toast({
        title: "Resumo gerado",
        description: "O resumo executivo foi gerado com sucesso!"
      });

    } catch (error: any) {
      console.error("Error generating summary:", error);
      
      if (error.status === 429) {
        toast({
          title: "Limite atingido",
          description: "Muitas requisições. Aguarde alguns minutos.",
          variant: "destructive"
        });
      } else if (error.status === 402) {
        toast({
          title: "Créditos esgotados",
          description: "Adicione créditos em Settings → Workspace → Usage",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro ao gerar resumo",
          description: error.message || "Tente novamente em alguns instantes.",
          variant: "destructive"
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadHTML = () => {
    if (!htmlContent) return;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumo-executivo-${projectName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "HTML exportado",
      description: "Arquivo HTML baixado com sucesso!"
    });
  };

  const handleDownloadPDF = async () => {
    if (!htmlContent) return;

    setIsGenerating(true);
    try {
      console.log("Generating PDF from HTML...");

      const { data, error } = await supabase.functions.invoke('generate-pdf', {
        body: { html: htmlContent }
      });

      if (error) {
        console.error("Error from PDF generation:", error);
        throw error;
      }

      if (!data?.pdf) {
        throw new Error("No PDF data received");
      }

      const blob = base64ToBlob(data.pdf, 'application/pdf');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resumo-executivo-${projectName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "PDF gerado",
        description: "Documento PDF baixado com sucesso!"
      });

    } catch (error: any) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Erro ao gerar PDF",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button
        onClick={generateExecutiveSummary}
        disabled={isGenerating}
        className="w-full bg-calc-summary text-white hover:opacity-90"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gerando resumo com IA...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Exportar Resumo Executivo
          </>
        )}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Resumo Executivo Gerado</DialogTitle>
            <DialogDescription>
              Preview do resumo executivo. Escolha o formato de download:
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto border rounded-lg mb-4">
            {htmlContent && (
              <iframe
                srcDoc={htmlContent}
                className="w-full h-full min-h-[500px]"
                title="Preview do Resumo Executivo"
              />
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              onClick={handleDownloadHTML}
              variant="outline"
              disabled={isGenerating}
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar HTML
            </Button>
            <Button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="bg-calc-summary text-white hover:opacity-90"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar PDF
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
