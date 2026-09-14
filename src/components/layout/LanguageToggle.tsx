import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  variant?: 'pill' | 'button' | 'compact';
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  variant = 'pill',
  className = '',
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');

  const toggleLanguage = () => {
    const nextLang = isArabic ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        title={isArabic ? 'Switch to English' : 'التحويل إلى العربية'}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer ${className}`}
      >
        <Globe className="w-3.5 h-3.5 text-school-600" />
        <span className="font-mono uppercase tracking-wide text-[11px]">{isArabic ? 'EN' : 'AR'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      title={isArabic ? 'Switch language to English' : 'تبديل اللغة إلى العربية'}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer group ${className}`}
    >
      <Globe className="w-3.5 h-3.5 text-school-600 group-hover:rotate-45 transition-transform duration-300" />
      <span>{isArabic ? 'English' : 'العربية'}</span>
    </button>
  );
};

