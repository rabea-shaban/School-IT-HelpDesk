import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  variant?: 'blue' | 'amber' | 'emerald' | 'rose' | 'slate';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  variant = 'blue',
  onClick,
}) => {
  const variantStyles = {
    blue: {
      border: 'border-blue-100 hover:border-blue-300',
      iconBg: 'bg-blue-50 text-blue-600',
      accent: 'from-blue-600 to-indigo-600',
    },
    amber: {
      border: 'border-amber-100 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600',
      accent: 'from-amber-500 to-orange-500',
    },
    emerald: {
      border: 'border-emerald-100 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600',
      accent: 'from-emerald-500 to-teal-600',
    },
    rose: {
      border: 'border-rose-100 hover:border-rose-300',
      iconBg: 'bg-rose-50 text-rose-600',
      accent: 'from-rose-500 to-red-600',
    },
    slate: {
      border: 'border-slate-200 hover:border-slate-300',
      iconBg: 'bg-slate-100 text-slate-700',
      accent: 'from-slate-700 to-slate-900',
    },
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-sm shadow-slate-900/5 transition-all duration-200 ${variantStyles.border} ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-500 tracking-wide uppercase">{title}</span>
        <div className={`p-2.5 rounded-xl ${variantStyles.iconBg}`}>{icon}</div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</div>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
              trend.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {description && <p className="mt-2 text-xs text-slate-500 leading-relaxed">{description}</p>}
    </div>
  );
};
