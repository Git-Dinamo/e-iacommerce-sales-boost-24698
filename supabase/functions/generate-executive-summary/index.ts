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

    const systemPrompt = `Você é um consultor financeiro sênior especializado em projetos de tecnologia e análise de viabilidade comercial.

Gere um RESUMO EXECUTIVO PROFISSIONAL em HTML completo usando Tailwind CSS via CDN.

REQUISITOS DO HTML:
- Documento HTML completo e válido (incluindo <!DOCTYPE html>, <html>, <head>, <body>)
- Tailwind CSS carregado via CDN no <head>
- Design moderno, profissional e "print-friendly"
- Utilize cores HSL do sistema de design (roxo: hsl(256, 70%, 66%), azul: hsl(204, 70%, 53%), verde: hsl(162, 73%, 46%))
- Responsivo e otimizado para A4 ao imprimir
- Estilo @media print para ocultar elementos desnecessários na impressão

ESTRUTURA OBRIGATÓRIA:
1. CABEÇALHO (header com gradiente):
   - Logo/título "Resumo Executivo"
   - Nome do projeto em destaque
   - Nome do cliente
   - Data de geração

2. MÉTRICAS PRINCIPAIS (grid de cards):
   - Receita Total Anual
   - Custo Total Anual
   - Margem Líquida Anual (%)
   - ROI Projetado
   Use cores semafóricas baseadas nas margens (verde > 30%, amarelo 15-30%, vermelho < 15%)

3. ANÁLISE DE IMPLANTAÇÃO:
   - Tabela de custos fonte (implantação)
   - Tabela de entregáveis comerciais (implantação)
   - Total implantação x custo implantação
   - Margem de implantação

4. ANÁLISE RECORRENTE:
   - Tabela de custos mensais fixos
   - Tabela de entregáveis mensais
   - Receita mensal x custo mensal
   - Margem de recorrência

5. PROJEÇÃO ANUAL:
   - Fluxo de caixa projetado para o prazo do contrato
   - Breakeven point
   - ROI acumulado

6. ANÁLISE DE VIABILIDADE:
   - Pontos fortes do projeto
   - Riscos identificados
   - Recomendações estratégicas
   - Conclusão sobre viabilidade comercial

FORMATAÇÃO:
- Use tabelas estilizadas com bordas e alternância de cores nas linhas
- Cards com sombras e bordas arredondadas
- Gradientes em cabeçalhos e seções importantes
- Ícones usando emojis (📊, 💰, 📈, ⚠️, ✅)
- Valores monetários formatados (R$ X.XXX,XX)
- Percentuais com 1 casa decimal

TOME CUIDADO:
- Todas as cores devem ser HSL
- Tabelas devem ter largura 100% e ser responsivas
- Print: remover botões e elementos interativos
- Manter hierarquia visual clara
- Use font-sans do Tailwind (Inter/system fonts)`;

    const userPrompt = `Gere o resumo executivo completo em HTML para os seguintes dados do projeto:

${JSON.stringify(projectData, null, 2)}

IMPORTANTE:
- Analise profundamente os números
- Identifique margens positivas e negativas
- Destaque riscos de margem < 15%
- Calcule ROI e breakeven
- Dê recomendações concretas e acionáveis
- O HTML deve ser COMPLETO e pronto para renderização`;

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
