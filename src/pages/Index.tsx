import { Calculator } from "@/components/Calculator";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background to-muted/20">

      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">Calculadora de Proposta</h1>
          
          <div className="bg-card border-2 border-primary/20 rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              🚀 O que já está incluso nesse pacote
            </h2>
            
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
              {/* Coluna 1 */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-lg">👩‍⚕️</span>
                  <p className="text-sm text-muted-foreground">Até 10 médicos + 5 secretárias</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">🤖</span>
                  <p className="text-sm text-muted-foreground">IA customizada (pré-atendimento, CRM, SAC, redes sociais)</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">📲</span>
                  <p className="text-sm text-muted-foreground">1.000 pré-atendimentos, lembretes e ações de CRM</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">📊</span>
                  <p className="text-sm text-muted-foreground">Painéis e relatórios analíticos</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">🔗</span>
                  <p className="text-sm text-muted-foreground">Integrações nativas, ERP e CRM</p>
                </div>
              </div>

              {/* Coluna 2 */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-lg">💬</span>
                  <p className="text-sm text-muted-foreground">Conexão WhatsApp + mensageria inclusa</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">🛠️</span>
                  <p className="text-sm text-muted-foreground">Configuração completa por consultoria</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">🎓</span>
                  <p className="text-sm text-muted-foreground">Workshop de imersão</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">👨‍💼</span>
                  <p className="text-sm text-muted-foreground">Gerente de Projeto dedicado</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">⚡</span>
                  <p className="text-sm text-muted-foreground">Suporte prioritário e síncrono</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">🧩</span>
                  <p className="text-sm text-muted-foreground">Desenvolvimento personalizado incluso</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Calculator />
      </div>
    </div>
  );
};

export default Index;
