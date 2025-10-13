interface ComplexityBadgeProps {
  level: 'low' | 'medium' | 'high';
}

const complexityConfig = {
  low: {
    label: 'Baixa',
    className: 'bg-calc-complexity-low'
  },
  medium: {
    label: 'Média', 
    className: 'bg-calc-complexity-medium'
  },
  high: {
    label: 'Alta',
    className: 'bg-calc-complexity-high'
  }
};

export const ComplexityBadge = ({ level }: ComplexityBadgeProps) => {
  const config = complexityConfig[level];
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white uppercase tracking-wide ${config.className}`}>
      {config.label}
    </span>
  );
};