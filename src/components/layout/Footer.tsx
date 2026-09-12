import React from 'react';
import { useTranslation } from 'react-i18next';
import { Monitor } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-slate-200/80 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-school-600" />
          <span className="font-bold text-slate-700">{t('nav.title')}</span>
          <span>&bull;</span>
          <span>{t('nav.subtitle')}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>{t('dashboard.fleetSubtitle')}</span>
        </div>
      </div>
    </footer>
  );
};
