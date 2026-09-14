import React from 'react';
import { useTranslation } from 'react-i18next';
import { Monitor } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-slate-200/80 py-5 sm:py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-slate-500 text-center sm:text-start">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <img
              src="/Ministry_of_Education_(Egypt)_logo_(wikiar).png"
              alt="وزارة التربية والتعليم"
              className="w-6 h-6 sm:w-7 sm:h-7 object-contain rounded-full"
            />
            <img
              src="/logo_AT.jpg"
              alt="التكنولوجيا التطبيقية"
              className="h-5 sm:h-6 w-auto object-contain rounded"
            />
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 sm:gap-1.5">
            <span className="font-bold text-slate-800">{t('nav.title')}</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="text-slate-500 font-medium">{t('nav.subtitle')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-medium text-[11px] sm:text-xs">
          <span>{t('dashboard.fleetSubtitle')}</span>
        </div>
      </div>
    </footer>
  );
};
