interface MarginIndicatorProps {
  value: number | string;
  type: 'currency' | 'percentage' | 'status';
  margin?: number;
}

export const MarginIndicator = ({ value, type, margin = 0 }: MarginIndicatorProps) => {
  const getMarginClass = (margin: number) => {
    if (margin >= 60) return 'bg-calc-margin-excellent';
    if (margin >= 45) return 'bg-calc-margin-good';
    if (margin >= 25) return 'bg-calc-margin-poor';
    return 'bg-calc-margin-critical';
  };

  const formatValue = () => {
    if (type === 'currency' && typeof value === 'number') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    }
    if (type === 'percentage' && typeof value === 'number') {
      return `${value.toFixed(1)}%`;
    }
    return value.toString();
  };

  if (type === 'status') {
    const statusClass = typeof value === 'string' && value.includes('EXCELENTE') 
      ? 'bg-calc-margin-excellent' 
      : 'bg-calc-margin-poor';
    
    return (
      <div className={`${statusClass} text-white px-3 py-1 rounded-md font-bold text-center text-sm`}>
        {typeof value === 'string' && value.includes('EXCELENTE') ? '✅ EXCELENTE' : '⚠️ REVISAR'}
      </div>
    );
  }

  return (
    <div className={`${getMarginClass(margin)} text-white px-3 py-1 rounded-md font-bold text-center`}>
      {formatValue()}
    </div>
  );
};