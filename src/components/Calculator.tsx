import { useState, useCallback } from 'react';
import { InputCell } from './InputCell';
import { MarginIndicator } from './MarginIndicator';
import { SummaryCard } from './SummaryCard';
import { Save, Maximize2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface CalculatorData {
  implantacao: {
    agente: number;
    lembretes: number;
    paineis: number;
    integracao: number;
    setup: number;
    treinamento: number;
  };
  recorrencia: {
    manutencao: number;
    infra: number;
    suporte: number;
  };
  simulacao: {
    descontoGlobal: number;
    prazoContrato: number;
    distribuicaoPagamento: number; // 0-100: 0 = tudo na implantação, 100 = tudo distribuído
  };
}

interface SimuladorContrato {
  descontoGlobal: number;
  prazoContrato: number;
  distribuicaoPagamento: number;
}

type ImplantacaoKey = keyof CalculatorData['implantacao'];
type RecorrenciaKey = keyof CalculatorData['recorrencia'];
type ComplexityLevel = 'low' | 'medium' | 'high' | 'removed';

interface Adicional {
  id: number;
  nome: string;
  unidade: string;
  quantidade: number;
  precoVenda: number;
  precoCusto: number;
}

interface CustosFonte {
  implantacao: Array<{
    id: number;
    nome: string;
    valor: number;
    descricao: string;
    observacao: string;
    multiplicadores: {
      baixa: number;
      media: number;
      alta: number;
    };
  }>;
  mensaisFixos: Array<{
    id: number;
    nome: string;
    valor: number;
    descricao: string;
    observacao: string;
    multiplicadores: {
      baixa: number;
      media: number;
      alta: number;
    };
  }>;
}

const CUSTOS_INTERNOS = {
  implantacao: {
    agente: 1500,
    lembretes: 2200,
    paineis: 2700,
    integracao: 1125,
    setup: 450,
    treinamento: 500
  },
  recorrencia: {
    manutencao: 750,
    infra: 280,
    suporte: 200
  }
};

const IMPLANTACAO_ITEMS: { key: ImplantacaoKey; name: string; defaultNote: string }[] = [
  { key: 'agente', name: 'Agente Pré-atendimento IA', defaultNote: 'Base existente, foco qualificação' },
  { key: 'lembretes', name: 'Sistema Lembretes + Reengajamento', defaultNote: 'Fluxos automatizados integrados' },
  { key: 'paineis', name: 'Painéis Analíticos IA', defaultNote: 'Dashboards + insights estratégicos' },
  { key: 'integracao', name: 'Integração Feegow + DigiSac', defaultNote: 'APIs nativas, centralização' },
  { key: 'setup', name: 'Setup e Configuração', defaultNote: 'Configuração inicial + testes' },
  { key: 'treinamento', name: 'Treinamento Equipe', defaultNote: 'Capacitação + documentação' }
];

const RECORRENCIA_ITEMS: { key: RecorrenciaKey; name: string; defaultNote: string }[] = [
  { key: 'manutencao', name: 'Manutenção Agentes IA', defaultNote: '6h/mês desenvolvimento' },
  { key: 'infra', name: 'Infraestrutura Cloud', defaultNote: 'Servidores + APIs + IA' },
  { key: 'suporte', name: 'Suporte e Melhorias', defaultNote: 'Análise + otimizações' }
];

interface CalculatorProps {
  projectId: string;
}

export const Calculator = ({ projectId }: CalculatorProps) => {
  const [activeTab, setActiveTab] = useState('comercial');
  const [data, setData] = useState<CalculatorData>({
    implantacao: {
      agente: 3800,
      lembretes: 5500,
      paineis: 6200,
      integracao: 2800,
      setup: 1500,
      treinamento: 2200
    },
    recorrencia: {
      manutencao: 1800,
      infra: 280,
      suporte: 450
    },
    simulacao: {
      descontoGlobal: 0,
      prazoContrato: 6, // Prazo fixo para o resumo financeiro geral
      distribuicaoPagamento: 20,
    },
  });

  // Estado separado para o simulador de contrato (não afeta outras abas)
  const [simuladorContrato, setSimuladorContrato] = useState<SimuladorContrato>({
    descontoGlobal: 0,
    prazoContrato: 12,
    distribuicaoPagamento: 20,
  });

  const [implantacaoComplexities, setImplantacaoComplexities] = useState<Record<ImplantacaoKey, ComplexityLevel>>({
    agente: 'low',
    lembretes: 'medium',
    paineis: 'medium',
    integracao: 'low',
    setup: 'low',
    treinamento: 'low'
  });

  const [implantacaoObservations, setImplantacaoObservations] = useState<Record<ImplantacaoKey, string>>(() =>
    IMPLANTACAO_ITEMS.reduce((acc, item) => {
      acc[item.key] = item.defaultNote;
      return acc;
    }, {} as Record<ImplantacaoKey, string>)
  );

  const [recorrenciaObservations, setRecorrenciaObservations] = useState<Record<RecorrenciaKey, string>>(() =>
    RECORRENCIA_ITEMS.reduce((acc, item) => {
      acc[item.key] = item.defaultNote;
      return acc;
    }, {} as Record<RecorrenciaKey, string>)
  );

  const [custosFonte, setCustosFonte] = useState<CustosFonte>({
    implantacao: [
      { 
        id: 1, 
        nome: 'Setup Inicial', 
        valor: 800, 
        descricao: 'Configuração inicial do ambiente',
        observacao: '',
        multiplicadores: { baixa: -30, media: 0, alta: 50 }
      },
      { 
        id: 2, 
        nome: 'Configuração Servidor', 
        valor: 500, 
        descricao: 'Deploy e configuração de infraestrutura',
        observacao: '',
        multiplicadores: { baixa: -30, media: 0, alta: 50 }
      },
      { 
        id: 3, 
        nome: 'Migração de Dados', 
        valor: 1200, 
        descricao: 'Importação e estruturação de dados',
        observacao: '',
        multiplicadores: { baixa: -30, media: 0, alta: 50 }
      },
      { 
        id: 4, 
        nome: 'Treinamento Equipe', 
        valor: 600, 
        descricao: 'Capacitação e documentação',
        observacao: '',
        multiplicadores: { baixa: -30, media: 0, alta: 50 }
      }
    ],
    mensaisFixos: [
      { 
        id: 1, 
        nome: 'Servidor VPS', 
        valor: 100, 
        descricao: '2-8GB RAM',
        observacao: '',
        multiplicadores: { baixa: -30, media: 0, alta: 50 }
      },
      { 
        id: 2, 
        nome: 'Banco de Dados', 
        valor: 80, 
        descricao: 'PostgreSQL/MySQL',
        observacao: '',
        multiplicadores: { baixa: -30, media: 0, alta: 50 }
      },
      { 
        id: 3, 
        nome: 'APIs Externas', 
        valor: 70, 
        descricao: 'Integrações',
        observacao: '',
        multiplicadores: { baixa: -30, media: 0, alta: 50 }
      },
      { 
        id: 4, 
        nome: 'Serviços IA (OpenAI)', 
        valor: 150, 
        descricao: 'Conforme uso',
        observacao: '',
        multiplicadores: { baixa: -30, media: 0, alta: 50 }
      },
      { 
        id: 5, 
        nome: 'Monitoramento', 
        valor: 60, 
        descricao: 'Logs e métricas',
        observacao: '',
        multiplicadores: { baixa: -30, media: 0, alta: 50 }
      },
      { 
        id: 6, 
        nome: 'CDN e Storage', 
        valor: 30, 
        descricao: 'Arquivos e cache',
        observacao: '',
        multiplicadores: { baixa: -30, media: 0, alta: 50 }
      }
    ]
  });

  const canEditObservacoes = true; // Permissões globais - todos podem editar

  const handleSaveTemplate = useCallback(() => {
    // Aqui futuramente salvar no banco de dados
    toast({
      title: "Template salvo com sucesso!",
      description: "As alterações no template da calculadora foram salvas.",
    });
  }, []);

  const [adicionais, setAdicionais] = useState<Adicional[]>([
    { 
      id: 1, 
      nome: 'Profissionais adicionais', 
      unidade: 'mês', 
      quantidade: 0, 
      precoVenda: 200, 
      precoCusto: 120 
    },
    { 
      id: 2, 
      nome: 'Secretárias adicionais', 
      unidade: 'mês', 
      quantidade: 0, 
      precoVenda: 100, 
      precoCusto: 60 
    },
    { 
      id: 3, 
      nome: 'Pré-atendimentos extras', 
      unidade: 'unidade', 
      quantidade: 0, 
      precoVenda: 1, 
      precoCusto: 0.6 
    },
    { 
      id: 4, 
      nome: 'Lembretes extras', 
      unidade: 'unidade', 
      quantidade: 0, 
      precoVenda: 0.5, 
      precoCusto: 0.3 
    },
    { 
      id: 5, 
      nome: 'Ações de CRM extras', 
      unidade: 'unidade', 
      quantidade: 0, 
      precoVenda: 0.8, 
      precoCusto: 0.48 
    }
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateMargin = (preco: number, custo: number) => {
    return ((preco - custo) / preco * 100);
  };

  const getMarginClass = (margin: number) => {
    if (margin >= 60) return 'excellent';
    if (margin >= 45) return 'good';
    if (margin >= 25) return 'poor';
    return 'critical';
  };

  const updateValue = useCallback((section: keyof CalculatorData, field: string, value: number) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  }, []);

  const updateSimuladorContrato = useCallback((field: keyof SimuladorContrato, value: number) => {
    setSimuladorContrato(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const updateAdicional = useCallback((id: number, field: keyof Adicional, value: number | string) => {
    setAdicionais(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  }, []);

  const updateMultiplicadorItem = useCallback((
    tipo: 'implantacao' | 'mensaisFixos',
    itemId: number,
    nivel: 'baixa' | 'media' | 'alta',
    valor: number
  ) => {
    setCustosFonte(prev => ({
      ...prev,
      [tipo]: prev[tipo].map(item =>
        item.id === itemId 
          ? { 
              ...item, 
              multiplicadores: { 
                ...item.multiplicadores, 
                [nivel]: valor 
              } 
            }
          : item
      )
    }));
  }, []);

  const adjustCostByComplexity = (
    baseCost: number, 
    level: ComplexityLevel, 
    multiplicadores: { baixa: number; media: number; alta: number }
  ) => {
    if (level === 'removed') return 0;
    
    if (level === 'low') return baseCost * (1 + multiplicadores.baixa / 100);
    if (level === 'high') return baseCost * (1 + multiplicadores.alta / 100);
    return baseCost * (1 + multiplicadores.media / 100); // medium
  };

  // Custos calculados dinamicamente baseados na fonte
  const totalCustosImplantacaoFonte = custosFonte.implantacao.reduce((sum, item) => sum + item.valor, 0);
  const totalCustosMensaisFonte = custosFonte.mensaisFixos.reduce((sum, item) => sum + item.valor, 0);

  const custosCalculados = {
    implantacao: {
      agente: totalCustosImplantacaoFonte * 0.15,
      lembretes: totalCustosImplantacaoFonte * 0.25,
      paineis: totalCustosImplantacaoFonte * 0.30,
      integracao: totalCustosImplantacaoFonte * 0.15,
      setup: totalCustosImplantacaoFonte * 0.08,
      treinamento: totalCustosImplantacaoFonte * 0.07
    },
    recorrencia: {
      manutencao: totalCustosMensaisFonte * 0.40,
      infra: totalCustosMensaisFonte * 0.45,
      suporte: totalCustosMensaisFonte * 0.15
    }
  };

  const getAdjustedImplantacaoCost = (key: ImplantacaoKey) => {
    const baseCost = custosCalculados.implantacao[key];
    const level = implantacaoComplexities[key];
    // Use multiplicadores médios de todos os itens de implantação
    const avgMultiplicadores = custosFonte.implantacao.reduce(
      (acc, item) => ({
        baixa: acc.baixa + item.multiplicadores.baixa / custosFonte.implantacao.length,
        media: acc.media + item.multiplicadores.media / custosFonte.implantacao.length,
        alta: acc.alta + item.multiplicadores.alta / custosFonte.implantacao.length
      }),
      { baixa: 0, media: 0, alta: 0 }
    );
    return adjustCostByComplexity(baseCost, level, avgMultiplicadores);
  };

  const adicionaisTotals = {
    totalVenda: adicionais.reduce((sum, item) => sum + (item.quantidade * item.precoVenda), 0),
    totalCusto: adicionais.reduce((sum, item) => sum + (item.quantidade * item.precoCusto), 0)
  };

  const totalCustoImplantacao = (Object.keys(custosCalculados.implantacao) as ImplantacaoKey[])
    .reduce((sum, key) => sum + getAdjustedImplantacaoCost(key), 0);

  const totals = {
    implantacao: Object.values(data.implantacao).reduce((sum, val) => sum + val, 0),
    recorrencia: Object.values(data.recorrencia).reduce((sum, val) => sum + val, 0) + adicionaisTotals.totalVenda,
    custoImplantacao: totalCustoImplantacao,
    custoRecorrencia: Object.values(custosCalculados.recorrencia).reduce((sum, val) => sum + val, 0) + adicionaisTotals.totalCusto
  };


  const margins = {
    implantacao: calculateMargin(totals.implantacao, totals.custoImplantacao),
    recorrencia: calculateMargin(totals.recorrencia, totals.custoRecorrencia)
  };

  const complexityStyles: Record<ComplexityLevel, string> = {
    low: 'bg-calc-complexity-low text-white',
    medium: 'bg-calc-complexity-medium text-white',
    high: 'bg-calc-complexity-high text-white',
    removed: 'bg-gray-200 text-gray-700'
  };

  return (
    <div className="min-h-screen bg-calc-main p-5">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-calc-header text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-3 text-shadow">
            🧮 Apenas para uso interno
          </h1>
          <p className="text-xl opacity-90">
            Calculadora de projetos personalizados premium da Clinicia.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-50 border-b-2 border-gray-200">
          {[
            { id: 'comercial', label: '💰 Precificação Comercial' },
            { id: 'custos', label: '📊 Custos Internos' },
            { id: 'custos-fonte', label: '🏗️ Custos Fonte' },
            { id: 'adicionais', label: '➕ Adicionais Recorrência' },
            { id: 'simulacoes', label: '🎯 Simulações' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`flex-1 p-5 text-lg font-semibold transition-all duration-300 border-r border-gray-300 last:border-r-0 hover:bg-gray-100 hover:-translate-y-1 ${
                activeTab === tab.id 
                  ? 'bg-calc-tab-active text-white shadow-md' 
                  : 'bg-gray-50 text-gray-700'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'comercial' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">💰 Precificação Comercial</h2>
                <Button onClick={handleSaveTemplate} className="gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Template
                </Button>
              </div>
              
              {/* Implantação Table */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <h3 className="text-xl font-bold p-4 bg-gray-100 border-b">🚀 IMPLANTAÇÃO</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-calc-table-header text-white">
                        <th className="p-4 text-left font-semibold">Componente</th>
                        <th className="p-4 text-left font-semibold">Complexidade</th>
                        <th className="p-4 text-left font-semibold w-64">Observações</th>
                        <th className="p-4 text-left font-semibold">Preço Venda (R$)</th>
                        <th className="p-4 text-left font-semibold">Custo Interno (R$)</th>
                        <th className="p-4 text-left font-semibold">Lucro Bruto (R$)</th>
                        <th className="p-4 text-left font-semibold">Margem (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {IMPLANTACAO_ITEMS.map(item => {
                        const preco = data.implantacao[item.key];
                        const custo = getAdjustedImplantacaoCost(item.key);
                        const margem = calculateMargin(preco, custo);
                        const complexidadeAtual = implantacaoComplexities[item.key];
                        const observacao = implantacaoObservations[item.key];
                        return (
                          <tr key={item.key} className="hover:bg-gray-50 transition-colors border-b">
                            <td className="p-4 font-medium">{item.name}</td>
                            <td className="p-4">
                              <Select
                                value={complexidadeAtual}
                                onValueChange={(value: ComplexityLevel) => {
                                  setImplantacaoComplexities(prev => ({
                                    ...prev,
                                    [item.key]: value
                                  }));
                                }}
                              >
                                <SelectTrigger className={`w-full font-semibold text-sm capitalize ${complexityStyles[complexidadeAtual]}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low" className="font-semibold">Baixa</SelectItem>
                                  <SelectItem value="medium" className="font-semibold">Média</SelectItem>
                                  <SelectItem value="high" className="font-semibold">Alta</SelectItem>
                                  <SelectItem value="removed" className="font-semibold">Remover</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="p-4 text-sm text-gray-600">
                              <div className="flex gap-2 items-start">
                                <div className="flex-1 min-w-0">
                                  {canEditObservacoes ? (
                                    <Textarea
                                      value={observacao}
                                      onChange={(event) =>
                                        setImplantacaoObservations(prev => ({
                                          ...prev,
                                          [item.key]: event.target.value,
                                        }))
                                      }
                                      placeholder="Adicione observações relevantes"
                                      className="min-h-[60px]"
                                    />
                                  ) : (
                                    <p className="whitespace-pre-wrap line-clamp-3">{observacao || '—'}</p>
                                  )}
                                </div>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                                      <Maximize2 className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>{item.name} - Observações</DialogTitle>
                                    </DialogHeader>
                                    <div className="mt-4">
                                      {canEditObservacoes ? (
                                        <Textarea
                                          value={observacao}
                                          onChange={(event) =>
                                            setImplantacaoObservations(prev => ({
                                              ...prev,
                                              [item.key]: event.target.value,
                                            }))
                                          }
                                          placeholder="Adicione observações relevantes"
                                          className="min-h-[200px]"
                                        />
                                      ) : (
                                        <p className="whitespace-pre-wrap text-base">{observacao || 'Sem observações'}</p>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </td>
                            <td className="p-4">
                              <InputCell
                                value={preco}
                                onChange={(value) => updateValue('implantacao', item.key, value)}
                              />
                            </td>
                            <td className="p-4 text-gray-600">{formatCurrency(custo)}</td>
                            <td className="p-4">
                              <MarginIndicator value={preco - custo} type="currency" margin={margem} />
                            </td>
                            <td className="p-4">
                              <MarginIndicator value={margem} type="percentage" margin={margem} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recorrência Table */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <h3 className="text-xl font-bold p-4 bg-gray-100 border-b">🔄 RECORRÊNCIA MENSAL</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-calc-table-header text-white">
                        <th className="p-4 text-left font-semibold">Item</th>
                        <th className="p-4 text-left font-semibold">Valor Mensal (R$)</th>
                        <th className="p-4 text-left font-semibold">Custo Interno (R$)</th>
                        <th className="p-4 text-left font-semibold">Lucro Bruto (R$)</th>
                        <th className="p-4 text-left font-semibold">Margem (%)</th>
                        <th className="p-4 text-left font-semibold">Observações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RECORRENCIA_ITEMS.map(item => {
                        const preco = data.recorrencia[item.key];
                        const custo = custosCalculados.recorrencia[item.key];
                        const lucro = preco - custo;
                        const margem = calculateMargin(preco, custo);
                        const observacao = recorrenciaObservations[item.key];
                        return (
                          <tr key={item.key} className="hover:bg-gray-50 transition-colors border-b">
                            <td className="p-4 font-medium">{item.name}</td>
                            <td className="p-4">
                              <InputCell
                                value={preco}
                                onChange={(value) => updateValue('recorrencia', item.key, value)}
                              />
                            </td>
                            <td className="p-4 text-gray-600">{formatCurrency(custo)}</td>
                            <td className="p-4">
                              <MarginIndicator value={lucro} type="currency" margin={margem} />
                            </td>
                            <td className="p-4">
                              <MarginIndicator value={margem} type="percentage" margin={margem} />
                            </td>
                            <td className="p-4 text-sm text-gray-600">
                              <div className="flex gap-2 items-start">
                                <div className="flex-1 min-w-0">
                                  {canEditObservacoes ? (
                                    <Textarea
                                      value={observacao}
                                      onChange={(event) =>
                                        setRecorrenciaObservations(prev => ({
                                          ...prev,
                                          [item.key]: event.target.value,
                                        }))
                                      }
                                      placeholder="Adicione observações relevantes"
                                      className="min-h-[60px]"
                                    />
                                  ) : (
                                    <p className="whitespace-pre-wrap line-clamp-3">{observacao || '—'}</p>
                                  )}
                                </div>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                                      <Maximize2 className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>{item.name} - Observações</DialogTitle>
                                    </DialogHeader>
                                    <div className="mt-4">
                                      {canEditObservacoes ? (
                                        <Textarea
                                          value={observacao}
                                          onChange={(event) =>
                                            setRecorrenciaObservations(prev => ({
                                              ...prev,
                                              [item.key]: event.target.value,
                                            }))
                                          }
                                          placeholder="Adicione observações relevantes"
                                          className="min-h-[200px]"
                                        />
                                      ) : (
                                        <p className="whitespace-pre-wrap text-base">{observacao || 'Sem observações'}</p>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <SummaryCard
                data={{
                  totalImplantacao: totals.implantacao,
                  totalRecorrencia: totals.recorrencia,
                  margemImplantacao: margins.implantacao,
                  margemRecorrencia: margins.recorrencia
                }}
                formatCurrency={formatCurrency}
              />

              <div className={`p-6 rounded-xl text-center text-xl font-bold text-white ${
                margins.implantacao >= 60 && margins.recorrencia >= 45 
                  ? 'bg-calc-margin-excellent' 
                  : margins.implantacao >= 45 && margins.recorrencia >= 35
                  ? 'bg-calc-margin-good'
                  : 'bg-calc-margin-poor'
              }`}>
                {margins.implantacao >= 60 && margins.recorrencia >= 45
                  ? '🎯 VIABILIDADE EXCELENTE - Margens dentro do padrão ideal!'
                  : margins.implantacao >= 45 && margins.recorrencia >= 35
                  ? '✅ VIABILIDADE BOA - Margens aceitáveis!'
                  : '⚠️ VIABILIDADE CRÍTICA - Revisar preços!'
                }
              </div>
            </div>
          )}

          {activeTab === 'custos' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800">📊 Custos Internos</h2>

              {/* Custos Implantação */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <h3 className="text-xl font-bold p-4 bg-gray-100 border-b">💼 Custos de Implantação (1,5 mês)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-calc-table-header text-white">
                        <th className="p-4 text-left font-semibold">Recurso</th>
                        <th className="p-4 text-left font-semibold">Custo/Mês</th>
                        <th className="p-4 text-left font-semibold">Total 1,5 Meses</th>
                        <th className="p-4 text-left font-semibold">Alocação por Entregável</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50 border-b">
                        <td className="p-4 font-medium">Desenvolvedor Pleno</td>
                        <td className="p-4">R$ 2.200</td>
                        <td className="p-4">R$ 3.300</td>
                        <td className="p-4">40% do custo total</td>
                      </tr>
                      <tr className="hover:bg-gray-50 border-b">
                        <td className="p-4 font-medium">Desenvolvedor Júnior</td>
                        <td className="p-4">R$ 1.500</td>
                        <td className="p-4">R$ 2.250</td>
                        <td className="p-4">25% do custo total</td>
                      </tr>
                      <tr className="hover:bg-gray-50 border-b">
                        <td className="p-4 font-medium">Analista de BI</td>
                        <td className="p-4">R$ 1.800</td>
                        <td className="p-4">R$ 2.700</td>
                        <td className="p-4">30% do custo total</td>
                      </tr>
                      <tr className="hover:bg-gray-50 border-b">
                        <td className="p-4 font-medium">Infraestrutura Dev</td>
                        <td className="p-4">R$ 150</td>
                        <td className="p-4">R$ 225</td>
                        <td className="p-4">5% do custo total</td>
                      </tr>
                      <tr className="bg-gray-100 font-bold">
                        <td className="p-4">TOTAL</td>
                        <td className="p-4">R$ 5.650</td>
                        <td className="p-4">R$ 8.475</td>
                        <td className="p-4">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Custos Recorrência */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <h3 className="text-xl font-bold p-4 bg-gray-100 border-b">🔄 Custos de Recorrência Mensal</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-calc-table-header text-white">
                        <th className="p-4 text-left font-semibold">Recurso</th>
                        <th className="p-4 text-left font-semibold">Custo Mensal</th>
                        <th className="p-4 text-left font-semibold">Percentual</th>
                        <th className="p-4 text-left font-semibold">Descrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50 border-b">
                        <td className="p-4 font-medium">Manutenção (6h Dev Pleno)</td>
                        <td className="p-4">R$ 750</td>
                        <td className="p-4">61%</td>
                        <td className="p-4">Otimizações e melhorias</td>
                      </tr>
                      <tr className="hover:bg-gray-50 border-b">
                        <td className="p-4 font-medium">Infraestrutura Real</td>
                        <td className="p-4">R$ 280</td>
                        <td className="p-4">23%</td>
                        <td className="p-4">Servidores, APIs, processamento IA</td>
                      </tr>
                      <tr className="hover:bg-gray-50 border-b">
                        <td className="p-4 font-medium">Overhead Analítico</td>
                        <td className="p-4">R$ 200</td>
                        <td className="p-4">16%</td>
                        <td className="p-4">Análise de performance, relatórios</td>
                      </tr>
                      <tr className="bg-gray-100 font-bold">
                        <td className="p-4">TOTAL</td>
                        <td className="p-4">R$ 1.230</td>
                        <td className="p-4">100%</td>
                        <td className="p-4">Custo base operacional</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <SummaryCard
                data={{
                  custoImplantacao: totals.custoImplantacao,
                  custoRecorrencia: totals.custoRecorrencia,
                  lucroImplantacao: totals.implantacao - totals.custoImplantacao,
                  lucroRecorrencia: totals.recorrencia - totals.custoRecorrencia
                }}
                formatCurrency={formatCurrency}
                type="costs"
              />
            </div>
          )}

          {activeTab === 'custos-fonte' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800">🏗️ Base de Custos Fonte</h2>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-sm text-yellow-700">
                  <strong>Atenção:</strong> Esta aba é a fonte única de verdade para todos os custos. 
                  Mudanças aqui afetam automaticamente todas as simulações e cálculos.
                </p>
              </div>
              
              {/* Custos de Implantação (One-time) */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-blue-100 border-b">
                  <h3 className="text-xl font-bold">🚀 Custos de Implantação (One-time)</h3>
                  <Button
                    onClick={() => {
                      const newId = Math.max(0, ...custosFonte.implantacao.map(i => i.id)) + 1;
                      setCustosFonte(prev => ({
                        ...prev,
                        implantacao: [
                          ...prev.implantacao,
                          { 
                            id: newId, 
                            nome: 'Novo Custo', 
                            valor: 0, 
                            descricao: '',
                            observacao: '',
                            multiplicadores: { baixa: -30, media: 0, alta: 50 }
                          }
                        ]
                      }));
                    }}
                    className="gap-2"
                  >
                    ➕ Adicionar Custo
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-calc-table-header text-white">
                        <th className="p-4 text-left font-semibold">Nome</th>
                        <th className="p-4 text-left font-semibold">Custo Base</th>
                        <th className="p-4 text-left font-semibold">Baixa %</th>
                        <th className="p-4 text-left font-semibold">Média %</th>
                        <th className="p-4 text-left font-semibold">Alta %</th>
                        <th className="p-4 text-left font-semibold">Descrição</th>
                        <th className="p-4 text-left font-semibold">Observações</th>
                        <th className="p-4 text-center font-semibold w-20">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {custosFonte.implantacao.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 border-b">
                          <td className="p-4">
                            <input
                              type="text"
                              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md font-medium focus:outline-none focus:border-blue-500"
                              value={item.nome}
                              onChange={(e) => {
                                setCustosFonte(prev => ({
                                  ...prev,
                                  implantacao: prev.implantacao.map(i =>
                                    i.id === item.id ? { ...i, nome: e.target.value } : i
                                  )
                                }));
                              }}
                            />
                          </td>
                          <td className="p-4">
                            <InputCell
                              value={item.valor}
                              onChange={(value) => {
                                setCustosFonte(prev => ({
                                  ...prev,
                                  implantacao: prev.implantacao.map(i =>
                                    i.id === item.id ? { ...i, valor: value } : i
                                  )
                                }));
                              }}
                            />
                          </td>
                          <td className="p-4">
                            <InputCell
                              value={item.multiplicadores.baixa}
                              onChange={(value) => updateMultiplicadorItem('implantacao', item.id, 'baixa', value)}
                            />
                          </td>
                          <td className="p-4">
                            <InputCell
                              value={item.multiplicadores.media}
                              onChange={(value) => updateMultiplicadorItem('implantacao', item.id, 'media', value)}
                            />
                          </td>
                          <td className="p-4">
                            <InputCell
                              value={item.multiplicadores.alta}
                              onChange={(value) => updateMultiplicadorItem('implantacao', item.id, 'alta', value)}
                            />
                          </td>
                          <td className="p-4">
                            <input
                              type="text"
                              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md text-gray-600 focus:outline-none focus:border-blue-500"
                              value={item.descricao}
                              onChange={(e) => {
                                setCustosFonte(prev => ({
                                  ...prev,
                                  implantacao: prev.implantacao.map(i =>
                                    i.id === item.id ? { ...i, descricao: e.target.value } : i
                                  )
                                }));
                              }}
                              placeholder="Descrição curta"
                            />
                          </td>
                          <td className="p-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="w-full">
                                  {item.observacao ? '📝 Editar' : '➕ Adicionar'}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Observações - {item.nome}</DialogTitle>
                                </DialogHeader>
                                <Textarea
                                  value={item.observacao}
                                  onChange={(e) => {
                                    setCustosFonte(prev => ({
                                      ...prev,
                                      implantacao: prev.implantacao.map(i =>
                                        i.id === item.id ? { ...i, observacao: e.target.value } : i
                                      )
                                    }));
                                  }}
                                  placeholder="Adicione observações detalhadas sobre este custo..."
                                  className="min-h-[200px]"
                                />
                              </DialogContent>
                            </Dialog>
                          </td>
                          <td className="p-4 text-center">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setCustosFonte(prev => ({
                                  ...prev,
                                  implantacao: prev.implantacao.filter(i => i.id !== item.id)
                                }));
                              }}
                            >
                              🗑️
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-blue-50 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Implantação:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(totalCustosImplantacaoFonte)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Custos Mensais Fixos */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-green-100 border-b">
                  <h3 className="text-xl font-bold">💰 Custos Mensais Fixos</h3>
                  <Button
                    onClick={() => {
                      const newId = Math.max(0, ...custosFonte.mensaisFixos.map(i => i.id)) + 1;
                      setCustosFonte(prev => ({
                        ...prev,
                        mensaisFixos: [
                          ...prev.mensaisFixos,
                          { 
                            id: newId, 
                            nome: 'Novo Custo', 
                            valor: 0, 
                            descricao: '',
                            observacao: '',
                            multiplicadores: { baixa: -30, media: 0, alta: 50 }
                          }
                        ]
                      }));
                    }}
                    className="gap-2"
                  >
                    ➕ Adicionar Custo
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-calc-table-header text-white">
                        <th className="p-4 text-left font-semibold">Nome</th>
                        <th className="p-4 text-left font-semibold">Valor Mensal</th>
                        <th className="p-4 text-left font-semibold">Baixa %</th>
                        <th className="p-4 text-left font-semibold">Média %</th>
                        <th className="p-4 text-left font-semibold">Alta %</th>
                        <th className="p-4 text-left font-semibold">Descrição</th>
                        <th className="p-4 text-left font-semibold">Observações</th>
                        <th className="p-4 text-center font-semibold w-20">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {custosFonte.mensaisFixos.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 border-b">
                          <td className="p-4">
                            <input
                              type="text"
                              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md font-medium focus:outline-none focus:border-blue-500"
                              value={item.nome}
                              onChange={(e) => {
                                setCustosFonte(prev => ({
                                  ...prev,
                                  mensaisFixos: prev.mensaisFixos.map(i =>
                                    i.id === item.id ? { ...i, nome: e.target.value } : i
                                  )
                                }));
                              }}
                            />
                          </td>
                          <td className="p-4">
                            <InputCell
                              value={item.valor}
                              onChange={(value) => {
                                setCustosFonte(prev => ({
                                  ...prev,
                                  mensaisFixos: prev.mensaisFixos.map(i =>
                                    i.id === item.id ? { ...i, valor: value } : i
                                  )
                                }));
                              }}
                            />
                          </td>
                          <td className="p-4">
                            <InputCell
                              value={item.multiplicadores.baixa}
                              onChange={(value) => updateMultiplicadorItem('mensaisFixos', item.id, 'baixa', value)}
                            />
                          </td>
                          <td className="p-4">
                            <InputCell
                              value={item.multiplicadores.media}
                              onChange={(value) => updateMultiplicadorItem('mensaisFixos', item.id, 'media', value)}
                            />
                          </td>
                          <td className="p-4">
                            <InputCell
                              value={item.multiplicadores.alta}
                              onChange={(value) => updateMultiplicadorItem('mensaisFixos', item.id, 'alta', value)}
                            />
                          </td>
                          <td className="p-4">
                            <input
                              type="text"
                              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md text-gray-600 focus:outline-none focus:border-blue-500"
                              value={item.descricao}
                              onChange={(e) => {
                                setCustosFonte(prev => ({
                                  ...prev,
                                  mensaisFixos: prev.mensaisFixos.map(i =>
                                    i.id === item.id ? { ...i, descricao: e.target.value } : i
                                  )
                                }));
                              }}
                              placeholder="Descrição curta"
                            />
                          </td>
                          <td className="p-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="w-full">
                                  {item.observacao ? '📝 Editar' : '➕ Adicionar'}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Observações - {item.nome}</DialogTitle>
                                </DialogHeader>
                                <Textarea
                                  value={item.observacao}
                                  onChange={(e) => {
                                    setCustosFonte(prev => ({
                                      ...prev,
                                      mensaisFixos: prev.mensaisFixos.map(i =>
                                        i.id === item.id ? { ...i, observacao: e.target.value } : i
                                      )
                                    }));
                                  }}
                                  placeholder="Adicione observações detalhadas sobre este custo..."
                                  className="min-h-[200px]"
                                />
                              </DialogContent>
                            </Dialog>
                          </td>
                          <td className="p-4 text-center">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setCustosFonte(prev => ({
                                  ...prev,
                                  mensaisFixos: prev.mensaisFixos.filter(i => i.id !== item.id)
                                }));
                              }}
                            >
                              🗑️
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-green-50 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Mensal:</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(totalCustosMensaisFonte)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Resumo dos Custos Fonte */}
              <div className="bg-calc-summary p-6 rounded-xl text-white">
                <h3 className="text-xl font-bold mb-4">📊 Resumo dos Custos Base</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-sm opacity-90">Total Implantação (One-time)</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(totalCustosImplantacaoFonte)}
                    </div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-sm opacity-90">Total Custos Mensais</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(totalCustosMensaisFonte)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'adicionais' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800">➕ Adicionais na Recorrência Mensal</h2>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <h3 className="text-xl font-bold p-4 bg-gray-100 border-b">📋 Itens Adicionais</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-calc-table-header text-white">
                        <th className="p-4 text-left font-semibold">Adicional</th>
                        <th className="p-4 text-left font-semibold">Unidade de Medida</th>
                        <th className="p-4 text-left font-semibold">Quantidade</th>
                        <th className="p-4 text-left font-semibold">Preço Unit. Venda</th>
                        <th className="p-4 text-left font-semibold">Preço Unit. Custo</th>
                        <th className="p-4 text-left font-semibold">Total Venda</th>
                        <th className="p-4 text-left font-semibold">Total Custo</th>
                        <th className="p-4 text-left font-semibold">Margem R$</th>
                        <th className="p-4 text-left font-semibold">Margem %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adicionais.map(item => {
                        const totalVenda = item.quantidade * item.precoVenda;
                        const totalCusto = item.quantidade * item.precoCusto;
                        const margemR = totalVenda - totalCusto;
                        const margemPercent = totalVenda > 0 ? (margemR / totalVenda * 100) : 0;
                        
                        return (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors border-b">
                            <td className="p-4 font-medium">{item.nome}</td>
                            <td className="p-4 text-gray-600">{item.unidade}</td>
                            <td className="p-4">
                              <InputCell
                                value={item.quantidade}
                                onChange={(value) => updateAdicional(item.id, 'quantidade', value)}
                              />
                            </td>
                            <td className="p-4">{formatCurrency(item.precoVenda)}</td>
                            <td className="p-4 text-gray-600">{formatCurrency(item.precoCusto)}</td>
                            <td className="p-4 font-medium">{formatCurrency(totalVenda)}</td>
                            <td className="p-4 text-gray-600">{formatCurrency(totalCusto)}</td>
                            <td className="p-4">
                              <MarginIndicator value={margemR} type="currency" margin={margemPercent} />
                            </td>
                            <td className="p-4">
                              <MarginIndicator value={margemPercent} type="percentage" margin={margemPercent} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Resumo dos Adicionais */}
              <div className="bg-calc-summary p-6 rounded-xl text-white">
                <h3 className="text-xl font-bold mb-4">📊 Resumo dos Adicionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-sm opacity-90">Total Venda Adicionais</div>
                    <div className="text-2xl font-bold">{formatCurrency(adicionaisTotals.totalVenda)}</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-sm opacity-90">Total Custo Adicionais</div>
                    <div className="text-2xl font-bold">{formatCurrency(adicionaisTotals.totalCusto)}</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-sm opacity-90">Lucro Bruto (R$)</div>
                    <div className="text-2xl font-bold">{formatCurrency(adicionaisTotals.totalVenda - adicionaisTotals.totalCusto)}</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-sm opacity-90">Margem % Geral</div>
                    <div className="text-2xl font-bold">
                      {adicionaisTotals.totalVenda > 0 
                        ? `${((adicionaisTotals.totalVenda - adicionaisTotals.totalCusto) / adicionaisTotals.totalVenda * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicador de Viabilidade dos Adicionais */}
              <div className={`p-6 rounded-xl text-center text-xl font-bold text-white ${
                adicionaisTotals.totalVenda > 0 
                  ? (((adicionaisTotals.totalVenda - adicionaisTotals.totalCusto) / adicionaisTotals.totalVenda * 100) >= 50
                    ? 'bg-calc-margin-excellent' 
                    : ((adicionaisTotals.totalVenda - adicionaisTotals.totalCusto) / adicionaisTotals.totalVenda * 100) >= 30
                    ? 'bg-calc-margin-good'
                    : 'bg-calc-margin-poor')
                  : 'bg-gray-400'
              }`}>
                {adicionaisTotals.totalVenda > 0 
                  ? (((adicionaisTotals.totalVenda - adicionaisTotals.totalCusto) / adicionaisTotals.totalVenda * 100) >= 50
                    ? '🎯 ADICIONAIS COM EXCELENTE MARGEM!'
                    : ((adicionaisTotals.totalVenda - adicionaisTotals.totalCusto) / adicionaisTotals.totalVenda * 100) >= 30
                    ? '✅ ADICIONAIS COM BOA MARGEM!'
                    : '⚠️ REVISAR MARGENS DOS ADICIONAIS!')
                  : '📝 Configure quantidades para ver análise de margem'
                }
              </div>
            </div>
          )}

          {activeTab === 'simulacoes' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800">💼 Simulador de Formas de Contratação</h2>
              
              {(() => {
                // Valores base do projeto usando o estado do simulador (independente)
                const valorTotalProjeto = totals.implantacao + (totals.recorrencia * simuladorContrato.prazoContrato) + adicionaisTotals.totalVenda;
                const valorComDesconto = valorTotalProjeto * (1 - simuladorContrato.descontoGlobal / 100);
                const impactoDesconto = valorTotalProjeto - valorComDesconto;
                
                // Distribuição do pagamento baseada na régua
                const percentualImplantacao = 100 - simuladorContrato.distribuicaoPagamento;
                const percentualMensal = simuladorContrato.distribuicaoPagamento;
                
                const valorImplantacao = valorComDesconto * (percentualImplantacao / 100);
                const valorMensalTotal = valorComDesconto * (percentualMensal / 100);
                const valorMensal = valorMensalTotal / simuladorContrato.prazoContrato;
                
                return (
                  <>
                    {/* Controles de Simulação */}
                    <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                      <h3 className="text-xl font-bold mb-6">🎛️ Controles de Negociação</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Desconto Global */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            💰 Desconto Global (%):
                          </label>
                          <input
                            type="number"
                            className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                            value={simuladorContrato.descontoGlobal}
                            min="0"
                            max="30"
                            onChange={(e) => updateSimuladorContrato('descontoGlobal', Number(e.target.value))}
                          />
                          <div className="mt-2 text-sm text-red-600 font-medium">
                            Impacto: -{formatCurrency(impactoDesconto)}
                          </div>
                        </div>

                        {/* Prazo Contrato */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ⏱️ Prazo Contrato (meses):
                          </label>
                          <input
                            type="number"
                            className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                            value={simuladorContrato.prazoContrato}
                            min="3"
                            max="36"
                            onChange={(e) => updateSimuladorContrato('prazoContrato', Number(e.target.value))}
                          />
                          <div className="mt-2 text-sm text-gray-600">
                            Meses adicionais aumentam custos recorrentes
                          </div>
                        </div>
                      </div>

                      {/* Régua de Distribuição */}
                      <div className="mt-8">
                        <label className="block text-lg font-semibold text-gray-800 mb-4">
                          🎚️ Distribuição do Pagamento
                        </label>
                        <div className="bg-white p-6 rounded-lg border-2 border-blue-200">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium text-blue-600">Tudo na Implantação</span>
                            <span className="text-sm font-medium text-purple-600">Distribuído Mensalmente</span>
                          </div>
                          
                          <div className="relative">
                            <input
                              type="range"
                              min="0"
                              max="80"
                              value={simuladorContrato.distribuicaoPagamento}
                              onChange={(e) => updateSimuladorContrato('distribuicaoPagamento', Number(e.target.value))}
                              className="w-full h-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                          </div>
                          
                          <div className="flex justify-between text-xs text-gray-600 mt-2">
                            <span>0%</span>
                            <span>20%</span>
                            <span>40%</span>
                            <span>60%</span>
                            <span>80%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resultado da Simulação */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <h3 className="text-xl font-bold p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">💼 Proposta de Pagamento</h3>
                      <div className="p-6">
                        
                        {/* Estrutura de Pagamento */}
                        <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200 max-w-md mx-auto">
                          <h4 className="text-lg font-bold text-purple-800 mb-4">💳 Estrutura de Pagamento</h4>
                          <div className="space-y-4">
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-gray-700">🎯 Valor Global Simulado:</span>
                                <span className="text-xl font-bold text-green-600">{formatCurrency(valorComDesconto)}</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                Valor total após desconto de {simuladorContrato.descontoGlobal}%
                              </div>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg border border-blue-200">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-blue-700">💰 Implantação:</span>
                                <span className="text-lg font-bold text-blue-600">{formatCurrency(valorImplantacao)}</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {percentualImplantacao.toFixed(0)}% do valor total
                              </div>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg border border-purple-200">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-purple-700">📅 Mensalidade:</span>
                                <span className="text-lg font-bold text-purple-600">{formatCurrency(valorMensal)}</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                Por {simuladorContrato.prazoContrato} meses ({percentualMensal.toFixed(0)}% distribuído)
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* Resumo Financeiro Global - Aparece em todas as abas EXCETO simulacoes */}
        {activeTab !== 'simulacoes' && (
        <div className="mt-8 px-8 pb-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <h3 className="text-xl font-bold p-4 bg-gray-100 border-b">📊 Resumo Financeiro Total do Projeto</h3>
            <div className="p-6">
              {(() => {
                // Cálculos totais do projeto
                const vendaTotalProjeto = totals.implantacao + (totals.recorrencia * data.simulacao.prazoContrato) + adicionaisTotals.totalVenda;
                const custoTotalProjeto = totals.custoImplantacao + (totals.custoRecorrencia * data.simulacao.prazoContrato) + adicionaisTotals.totalCusto;
                const lucroBrutoProjeto = vendaTotalProjeto - custoTotalProjeto;
                
                // Margens e custos administrativos
                const margemAdministrativa = vendaTotalProjeto * 0.20; // 20%
                const margemTributaria = vendaTotalProjeto * 0.10; // 10% 
                const lucroLiquidoProjeto = lucroBrutoProjeto - margemAdministrativa - margemTributaria;
                const margemLiquidaPercent = vendaTotalProjeto > 0 ? (lucroLiquidoProjeto / vendaTotalProjeto * 100) : 0;
                
                return (
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                      
                      {/* Receita e Custos Base */}
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center py-2">
                          <span className="text-lg font-medium text-gray-700">💰 Receita Total do Projeto:</span>
                          <span className="text-2xl font-bold text-green-600">{formatCurrency(vendaTotalProjeto)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-lg font-medium text-gray-700">📊 Custo Total do Projeto:</span>
                          <span className="text-xl font-semibold text-gray-600">{formatCurrency(custoTotalProjeto)}</span>
                        </div>
                        <div className="border-t-2 border-gray-300 pt-3">
                          <div className="flex justify-between items-center py-2">
                            <span className="text-xl font-bold text-gray-800">🎯 LUCRO BRUTO:</span>
                            <span className="text-3xl font-bold text-blue-600">{formatCurrency(lucroBrutoProjeto)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Deduções e Margens */}
                      <div className="bg-white p-5 rounded-lg border border-gray-200 mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">📋 Deduções Operacionais:</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-700 font-medium">(-) Margem Administrativa (20%):</span>
                            <span className="font-semibold text-red-600">-{formatCurrency(margemAdministrativa)}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-700 font-medium">(-) Margem Tributária (10%):</span>
                            <span className="font-semibold text-red-600">-{formatCurrency(margemTributaria)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Resultado Final */}
                      <div className={`p-6 rounded-xl text-center border-3 ${
                        margemLiquidaPercent >= 25 
                          ? 'bg-green-50 border-green-300 text-green-800' 
                          : margemLiquidaPercent >= 15
                          ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                          : 'bg-red-50 border-red-300 text-red-800'
                      }`}>
                        <div className="mb-3">
                          <span className="text-2xl font-bold">🏆 LUCRO LÍQUIDO FINAL:</span>
                        </div>
                        <div className="text-4xl font-black mb-2">
                          {formatCurrency(lucroLiquidoProjeto)}
                        </div>
                        <div className="text-xl font-semibold">
                          Margem Líquida: {margemLiquidaPercent.toFixed(1)}%
                        </div>
                        <div className="mt-3 text-sm font-medium">
                          {margemLiquidaPercent >= 25 
                            ? '🎯 PROJETO ALTAMENTE LUCRATIVO!' 
                            : margemLiquidaPercent >= 15
                            ? '✅ PROJETO VIÁVEL!'
                            : '⚠️ REVISAR ESTRATÉGIA DE PRECIFICAÇÃO!'
                          }
                        </div>
                      </div>
                      
                      {/* Breakdown Detalhado */}
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <div className="font-semibold text-blue-700">Implantação</div>
                          <div className="text-lg font-bold text-blue-600">{formatCurrency(totals.implantacao)}</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                          <div className="font-semibold text-purple-700">Recorrência ({data.simulacao.prazoContrato}m)</div>
                          <div className="text-lg font-bold text-purple-600">{formatCurrency(totals.recorrencia * data.simulacao.prazoContrato)}</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <div className="font-semibold text-green-700">Adicionais</div>
                          <div className="text-lg font-bold text-green-600">{formatCurrency(adicionaisTotals.totalVenda)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};