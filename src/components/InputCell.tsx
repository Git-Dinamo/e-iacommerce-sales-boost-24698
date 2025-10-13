interface InputCellProps {
  value: number;
  onChange: (value: number) => void;
  readonly?: boolean;
}

export const InputCell = ({ value, onChange, readonly = false }: InputCellProps) => {
  if (readonly) {
    return (
      <div className="bg-gray-100 border-2 border-gray-300 text-gray-600 px-3 py-2 rounded-md min-w-[120px] font-semibold">
        R$ {value.toLocaleString('pt-BR')}
      </div>
    );
  }

  return (
    <input
      type="number"
      className="bg-calc-input-bg border-2 border-calc-input-border px-3 py-2 rounded-md font-semibold min-w-[120px] focus:outline-none focus:border-calc-input-focus focus:shadow-lg transition-all duration-200"
      value={value}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
    />
  );
};