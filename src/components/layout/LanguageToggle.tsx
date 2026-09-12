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
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs active:scale-95 ${className}`}
      >
        <Globe className="w-3.5 h-3.5 text-school-600" />
        <span className="font-mono uppercase">{isArabic ? 'EN' : 'عربي'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      title={isArabic ? 'Switch language to English' : 'تبديل اللغة إلى العربية'}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white/95 hover:bg-slate-100/80 text-slate-800 text-xs font-extrabold shadow-xs transition-all active:scale-95 cursor-pointer ${className}`}
    >
      <Globe className="w-3.5 h-3.5 text-school-600" />
      <span>{isArabic ? 'English' : 'العربية'}</span>
    </button>
  );
};
