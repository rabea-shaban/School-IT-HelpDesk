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
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white/90 hover:bg-slate-50 text-slate-700 text-xs font-black transition-all shadow-xs active:scale-95 cursor-pointer backdrop-blur-sm ${className}`}
      >
        <Globe className="w-3.5 h-3.5 text-school-600" />
        <span className="font-mono uppercase tracking-wide">{isArabic ? 'EN' : 'عربي'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      title={isArabic ? 'Switch language to English' : 'تبديل اللغة إلى العربية'}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200/80 bg-slate-50/90 hover:bg-white hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-extrabold shadow-xs transition-all active:scale-95 cursor-pointer backdrop-blur-sm group ${className}`}
    >
      <Globe className="w-3.5 h-3.5 text-school-600 group-hover:rotate-12 transition-transform" />
      <span className="tracking-tight">{isArabic ? 'English' : 'العربية'}</span>
      <span className="px-1.5 py-0.2 rounded bg-school-100 text-school-700 text-[10px] font-mono font-bold uppercase">
        {isArabic ? 'EN' : 'AR'}
      </span>
    </button>
  );
};

