import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating executive summary for project:", projectData.projeto.nome);

    const systemPrompt = `Você é um especialista em Business Intelligence e visualização de dados financeiros.

Gere um DASHBOARD EXECUTIVO PROFISSIONAL em HTML completo usando Tailwind CSS via CDN.

⚠️ CRÍTICO - REGRAS OBRIGATÓRIAS:
1. NUNCA use template literals (\`\${variavel}\`) no HTML - sempre calcule ANTES e insira o VALOR FINAL
2. NUNCA deixe código JavaScript visível no HTML renderizado
3. Todos os cálculos devem ser feitos INLINE usando apenas os valores numéricos fornecidos
4. Use APENAS operações matemáticas diretas com os números dos dados fornecidos

REQUISITOS DO HTML:
- Documento HTML completo e válido (<!DOCTYPE html>, <html>, <head>, <body>)
- Tailwind CSS via CDN: https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css
- Design tipo BI/Dashboard com FOCO EM VISUALIZAÇÃO DE DADOS
- Cores HSL: roxo hsl(256, 70%, 66%), azul hsl(204, 70%, 53%), verde hsl(162, 73%, 46%)
- Responsivo e otimizado para impressão A4
- @media print para layout limpo

ESTRUTURA DO DASHBOARD (TIPO BI):

1. 🎯 HEADER EXECUTIVO:
   - Título "Dashboard Executivo Financeiro"
   - Nome do projeto + cliente
   - Data de geração
   - Badge com prazo do contrato (ex: "Análise 12 meses")

2. 📊 PAINEL DE KPIs (Grid 2x2 ou 1x4):
   Cards grandes e visuais com:
   - 💰 Receita Total do Projeto (valor + ícone) - Projetada para [simulacao.prazoContrato] meses
   - 💸 Custo Total do Projeto (valor + ícone) - Projetado para [simulacao.prazoContrato] meses
   - 📈 Margem Líquida % (com barra de progresso colorida)
   - 🎯 Lucro Líquido do Projeto (destaque positivo/negativo) - Para [simulacao.prazoContrato] meses
   
   ⚠️ CÁLCULOS FINANCEIROS OBRIGATÓRIOS:
   
   MARGEM BRUTA:
   - Margem Bruta (R$) = Receita Total - Custo Total
   - Margem Bruta (%) = (Margem Bruta / Receita Total) × 100
   
   DEDUÇÕES FIXAS:
   - Tributos = 10% da Receita Total
   - Margem Administrativa = 20% da Receita Total
   - Total de Deduções = Tributos + Margem Administrativa (sempre 30% da Receita)
   
   MARGEM LÍQUIDA:
   - Margem Líquida (R$) = Margem Bruta - Tributos - Margem Administrativa
   - Margem Líquida (%) = (Margem Líquida / Receita Total) × 100
   - OU: Margem Líquida (%) = Margem Bruta (%) - 30%
   
   LUCRO LÍQUIDO:
   - Lucro Líquido = Margem Líquida (em R$)
   - É o valor final após todas as deduções
   
   EXEMPLO PRÁTICO:
   Se Receita = R$ 12.800,00 e Custo = R$ 3.843,42
   - Margem Bruta = 12.800 - 3.843,42 = R$ 8.956,58
   - Margem Bruta % = (8.956,58 / 12.800) × 100 = 69,97%
   - Tributos (10%) = 12.800 × 0,10 = R$ 1.280,00
   - Margem Admin (20%) = 12.800 × 0,20 = R$ 2.560,00
   - Margem Líquida = 8.956,58 - 1.280 - 2.560 = R$ 5.116,58
   - Margem Líquida % = 69,97% - 30% = 39,97%
   - Lucro Líquido = R$ 5.116,58
   
   NO PAINEL DE KPIs, EXIBIR:
   - Card "Margem Líquida %" mostrando o valor LÍQUIDO (após tributos e admin)
   - Card "Lucro Líquido" mostrando o valor em R$ líquido
   
   Cores semafóricas (baseadas na Margem Líquida %):
   - Verde: margem líquida > 30%
   - Amarelo: margem líquida 15-30%
   - Vermelho: margem líquida < 15%

3. 💼 BREAKDOWN IMPLANTAÇÃO:
   Seção com 2 colunas:
   
   COLUNA 1 - Custos Fonte (Implantação):
   - Tabela estilizada listando cada custo
   - Colunas: Nome | Descrição | Valor
   - Footer: TOTAL CUSTOS IMPLANTAÇÃO
   
   COLUNA 2 - Entregáveis Comerciais (Implantação):
   - Tabela listando cada entregável
   - Colunas: Nome | Qtd | Preço Unit. | Total
   - Footer: TOTAL RECEITA IMPLANTAÇÃO
   
    Card de Resumo Implantação:
    - Receita vs Custo (barras lado a lado)
    - Margem Bruta R$ e %
    - Margem Líquida R$ e % (após tributos e admin)
    - Destacar claramente: "Margem Bruta: XX% | Margem Líquida: XX% (após 30% deduções)"

4. 🔄 BREAKDOWN RECORRÊNCIA MENSAL:
   Seção com 2 colunas:
   
   COLUNA 1 - Custos Mensais Fixos:
   - Tabela estilizada
   - Colunas: Nome | Descrição | Valor/mês
   - Footer: TOTAL CUSTOS MENSAIS
   
   COLUNA 2 - Entregáveis Mensais:
   - Tabela listando entregáveis recorrentes
   - Colunas: Nome | Qtd | Preço Unit. | Total/mês
   - Footer: TOTAL RECEITA MENSAL
   
    Card de Resumo Recorrência:
    - Receita vs Custo mensal (barras)
    - Margem Bruta R$ e %
    - Margem Líquida R$ e % (após tributos e admin)
    - Destacar claramente: "Margem Bruta: XX% | Margem Líquida: XX% (após 30% deduções)"

5. 📈 PROJEÇÃO DE FLUXO DE CAIXA:
   Tabela mês a mês (do mês 0 até o prazo do contrato informado em simulacao.prazoContrato):
   
   Colunas:
   | Mês | Receita (R$) | Custo (R$) | Lucro Mensal (R$) | Lucro Acumulado (R$) |
   
   CÁLCULOS:
   - Mês 0: Implantação (receita implantação - custo implantação)
   - Mês 1 até simulacao.prazoContrato: Recorrência (receita mensal - custo mensal)
   - Lucro Acumulado: soma cumulativa
   
   ⚠️ IMPORTANTE: Calcule cada linha da tabela usando os valores numéricos fornecidos
   Exemplo: Se receitaMensal = 5000 e custoMensal = 2000, então lucroMensal = 3000
   
   Destacar:
   - Mês do Breakeven (quando acumulado fica positivo)
   - Linha total ao final

6. 💡 QUADRO DE CÁLCULOS FINANCEIROS:
   Box informativo mostrando a composição da margem:
   - Receita Total: R$ XXX
   - (-) Custo Total: R$ XXX
   - (=) Margem Bruta: R$ XXX (XX%)
   - (-) Tributos (10%): R$ XXX
   - (-) Margem Administrativa (20%): R$ XXX
   - (=) Lucro Líquido: R$ XXX (Margem Líquida XX%)
   
7. 🎯 INDICADORES CHAVE:
   Grid de mini-cards:
   - 🏁 Breakeven Point: "Mês X" ou "Não atingido"
   - 💹 ROI Total: "X%" (calculado: lucro líquido total / custo total * 100)
   - 📊 Margem Bruta Implantação: "X%"
   - 📊 Margem Líquida Implantação: "X%" (margem bruta - 30%)
   - 🔄 Margem Bruta Recorrência: "X%"
   - 🔄 Margem Líquida Recorrência: "X%" (margem bruta - 30%)

FORMATAÇÃO VISUAL:
- Tabelas: bordas finas, linhas alternadas (bg-gray-50), headers coloridos
- Cards: shadow-lg, rounded-lg, padding generoso
- Gradientes em headers principais
- Números: font-bold, tamanho grande para KPIs
- Use emojis para ícones visuais
- Barras de progresso para margens
- Cores condicionais (verde/amarelo/vermelho) baseadas em performance

⚠️ FORMATAÇÃO DE VALORES MONETÁRIOS (CRÍTICO):
- TODOS os valores em reais devem seguir o padrão brasileiro: R$ 9.000,00
- Use ponto (.) como separador de milhares
- Use vírgula (,) como separador decimal
- Sempre 2 casas decimais
- Exemplos: R$ 1.500,00 | R$ 12.800,00 | R$ 3.843,42 | R$ 8.956,58
- Nunca use formato americano (12800.00)

NÃO INCLUIR:
❌ Análise de viabilidade textual
❌ Recomendações estratégicas
❌ Pontos fortes/fracos narrativos
❌ Conclusões escritas

FOCO: Dados puros, visualizações claras, métricas objetivas - um verdadeiro dashboard BI.`;

    const userPrompt = `Gere o dashboard BI completo em HTML para os seguintes dados do projeto:

${JSON.stringify(projectData, null, 2)}

INSTRUÇÕES FINAIS:
- Calcule TODOS os valores antes de inserir no HTML (nunca use template literals como \${variavel})
- Gere tabela de fluxo de caixa mês a mês com valores calculados
- Identifique o mês de breakeven (quando lucro acumulado fica positivo)
- Use cores semafóricas para margens (verde/amarelo/vermelho)
- Crie visualizações tipo dashboard/BI com foco em DADOS OBJETIVOS
- NÃO inclua análises textuais, recomendações ou narrativas
- O HTML deve ser COMPLETO, VÁLIDO e pronto para renderização direta
- ⚠️ CRÍTICO: TODOS os valores monetários DEVEM usar formato brasileiro: R$ 9.000,00 (ponto para milhares, vírgula para decimais)
- ⚠️ CRÍTICO: DIFERENCIE SEMPRE MARGEM BRUTA DE MARGEM LÍQUIDA:
  * Margem Bruta = Receita - Custo (antes de tributos e admin)
  * Margem Líquida = Margem Bruta - 10% Tributos - 20% Admin (sempre 30% a menos que bruta)
  * Nos KPIs principais, exiba MARGEM LÍQUIDA %
  * Nos resumos de implantação/recorrência, mostre AMBAS (bruta e líquida)
  * Deixe claro em cada seção qual tipo de margem está sendo exibida
- Inclua um quadro explicativo mostrando a composição: Receita - Custo = Margem Bruta, depois - Tributos - Admin = Lucro Líquido`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const htmlContent = data.choices[0].message.content;

    console.log("Executive summary generated successfully");

    return new Response(
      JSON.stringify({ html: htmlContent }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );

  } catch (error) {
    console.error("Error in generate-executive-summary:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
