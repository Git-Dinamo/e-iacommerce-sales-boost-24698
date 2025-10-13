import { Edit, Eye, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';

type PermissionLevel = 'none' | 'view' | 'edit';

interface PermissionToggleProps {
  level: PermissionLevel;
  onChange: (newLevel: PermissionLevel) => void;
  disabled?: boolean;
}

const PermissionToggle = ({ level, onChange, disabled = false }: PermissionToggleProps) => {
  const getNextLevel = (current: PermissionLevel): PermissionLevel => {
    const cycle: PermissionLevel[] = ['none', 'view', 'edit'];
    const currentIndex = cycle.indexOf(current);
    return cycle[(currentIndex + 1) % cycle.length];
  };

  const handleClick = () => {
    if (!disabled) {
      onChange(getNextLevel(level));
    }
  };

  const configs = {
    none: {
      icon: Ban,
      label: 'Sem acesso',
      bgColor: 'bg-gray-100 hover:bg-gray-200',
      textColor: 'text-gray-600',
      iconColor: 'text-gray-500',
    },
    view: {
      icon: Eye,
      label: 'Ver',
      bgColor: 'bg-blue-100 hover:bg-blue-200',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600',
    },
    edit: {
      icon: Edit,
      label: 'Editar',
      bgColor: 'bg-green-100 hover:bg-green-200',
      textColor: 'text-green-700',
      iconColor: 'text-green-600',
    },
  };

  const config = configs[level];
  const Icon = config.icon;

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
        config.bgColor,
        config.textColor,
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      )}
    >
      <Icon className={cn('w-4 h-4', config.iconColor)} />
      {config.label}
    </button>
  );
};

export default PermissionToggle;
