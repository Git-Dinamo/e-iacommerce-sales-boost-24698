interface SummaryCardProps {
  data: {
    totalImplantacao?: number;
    totalRecorrencia?: number;
    margemImplantacao?: number;
    margemRecorrencia?: number;
    custoImplantacao?: number;
    custoRecorrencia?: number;
    lucroImplantacao?: number;
    lucroRecorrencia?: number;
    roi?: number;
    receita12Meses?: number;
    lucro12Meses?: number;
    margemMediaAnual?: number;
  };
  formatCurrency: (value: number) => string;
  type?: 'default' | 'costs' | 'simulation';
}

export const SummaryCard = ({ data, formatCurrency, type = 'default' }: SummaryCardProps) => {
  const renderContent = () => {
    if (type === 'costs') {
      return (
        <>
          <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg">
            <span className="font-semibold text-lg">💸 Custo Total Implantação:</span>
            <span className="text-xl font-bold">{formatCurrency(data.custoImplantacao || 0)}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg">
            <span className="font-semibold text-lg">📊 Custo Recorrência Mensal:</span>
            <span className="text-xl font-bold">{formatCurrency(data.custoRecorrencia || 0)}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg">
            <span className="font-semibold text-lg">💰 Lucro Bruto Implantação:</span>
            <span className="text-xl font-bold">{formatCurrency(data.lucroImplantacao || 0)}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg">
            <span className="font-semibold text-lg">🔄 Lucro Bruto Recorrência:</span>
            <span className="text-xl font-bold">{formatCurrency(data.lucroRecorrencia || 0)}</span>
          </div>
        </>
      );
    }

    if (type === 'simulation') {
      return (
        <>
          <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg">
            <span className="font-semibold text-lg">📈 ROI Cliente Estimado:</span>
            <span className="text-xl font-bold">{data.roi}%</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg">
            <span className="font-semibold text-lg">💰 Receita 12 meses:</span>
            <span className="text-xl font-bold">{formatCurrency(data.receita12Meses || 0)}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg">
            <span className="font-semibold text-lg">🎯 Lucro 12 meses:</span>
            <span className="text-xl font-bold">{formatCurrency(data.lucro12Meses || 0)}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg">
            <span className="font-semibold text-lg">📊 Margem Média Anual:</span>
            <span className="text-xl font-bold">{(data.margemMediaAnual || 0).toFixed(1)}%</span>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg">
          <span className="font-semibold text-lg">💰 Total Implantação:</span>
          <span className="text-xl font-bold">{formatCurrency(data.totalImplantacao || 0)}</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg">
          <span className="font-semibold text-lg">🔄 Total Recorrência Mensal:</span>
          <span className="text-xl font-bold">{formatCurrency(data.totalRecorrencia || 0)}</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg">
          <span className="font-semibold text-lg">📈 Margem Implantação:</span>
          <span className="text-xl font-bold">{(data.margemImplantacao || 0).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg">
          <span className="font-semibold text-lg">📊 Margem Recorrência:</span>
          <span className="text-xl font-bold">{(data.margemRecorrencia || 0).toFixed(1)}%</span>
        </div>
      </>
    );
  };

  return (
    <div className="bg-calc-summary text-white p-6 rounded-2xl shadow-xl space-y-3">
      {renderContent()}
    </div>
  );
};