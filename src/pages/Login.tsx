import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Lock,
  Mail,
  ArrowRight,
  Monitor,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg(t('auth.enterCredentials'));
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const user = await login(email.trim(), password);
      showSuccess(`${t('auth.welcomeAdmin')}, ${user.displayName || user.email}!`, t('auth.loginSuccess'));
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg(
        err.message || t('auth.loginError')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 flex flex-col justify-center py-10 sm:py-12 px-4 sm:px-6 lg:px-8 selection:bg-school-500 selection:text-white">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex flex-col items-center gap-3 group">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-white p-1.5 rounded-2xl shadow-md">
              <img
                src="/Ministry_of_Education_(Egypt)_logo_(wikiar).png"
                alt="وزارة التربية والتعليم"
                className="w-12 h-12 object-contain rounded-full"
              />
            </div>
            <div className="bg-white p-1.5 rounded-2xl shadow-md">
              <img
                src="/logo_AT.jpg"
                alt="التكنولوجيا التطبيقية"
                className="h-12 w-auto object-contain rounded-xl"
              />
            </div>
          </div>
          <span className="font-black text-2xl tracking-tight text-white group-hover:text-school-400 transition-colors">
            {t('nav.title')}
          </span>
        </Link>
        <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t('auth.adminLoginTitle')}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          {t('auth.adminLoginSubtitle')}
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-7 px-5 sm:px-8 shadow-2xl rounded-3xl border border-slate-100 space-y-5">
          {/* Security Badge */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-school-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-900">{t('auth.securityBadgeTitle')}</h4>
              <p className="text-[11px] text-slate-500">
                {t('auth.securityNotice')}
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-fadeIn leading-relaxed">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('auth.emailLabel')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 rtl:left-auto rtl:right-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-base sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-school-100 focus:border-school-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('auth.passwordLabel')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 rtl:left-auto rtl:right-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-base sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-school-100 focus:border-school-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              variant="primary"
              isLoading={isLoading}
              className="w-full text-sm font-bold shadow-lg shadow-school-600/20 py-3"
              rightIcon={<ArrowRight className="w-4 h-4 rtl:rotate-180" />}
            >
              {t('auth.signInButton')}
            </Button>
          </form>
        </div>

        {/* Back to public link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-white transition-colors underline"
          >
            {t('auth.backToSubmit')}
          </Link>
        </div>
      </div>
    </div>
  );
};
