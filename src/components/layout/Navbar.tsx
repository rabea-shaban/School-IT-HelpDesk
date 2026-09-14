import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Ticket as TicketIcon,
  Server,
  Layers,
  LogOut,
  LogIn,
  PlusCircle,
  Menu,
  X,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { LanguageToggle } from './LanguageToggle';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Brand Accent Line */}
      <div className="h-0.5 sm:h-1 w-full bg-gradient-to-r from-school-600 via-orange-500 to-indigo-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[4.25rem] gap-4">
          {/* Start Group: Logo & Desktop Navigation */}
          <div className="flex items-center gap-3 lg:gap-6 shrink-0">
            {/* Logo & Brand Unit */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group select-none shrink-0">
              {/* Unified High-Tech Brand Capsule */}
              <div className="bg-gradient-to-r from-[#061426] via-[#0b2444] to-[#0f3057] px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl border border-slate-700/80 shadow-sm shadow-slate-950/20 flex items-center gap-2 sm:gap-2.5 group-hover:border-school-400/50 group-hover:shadow-md transition-all duration-300">
                <img
                  src="/logochool.svg"
                  alt="B.TECH"
                  className="h-4 sm:h-4.5 w-auto object-contain"
                />
                <div className="w-px h-3.5 sm:h-4 bg-white/20" />
                <img
                  src="/Ministry_of_Education_(Egypt)_logo_(wikiar).png"
                  alt="وزارة التربية والتعليم"
                  className="w-5 h-5 sm:w-5.5 sm:h-5.5 object-contain drop-shadow-sm"
                />
              </div>

              {/* School Title & Status Capsule */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs sm:text-sm lg:text-base tracking-tight text-slate-900 group-hover:text-school-600 transition-colors whitespace-nowrap">
                    {t('nav.title')}
                  </span>
                  <span className="hidden 2xl:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-black uppercase tracking-wider shadow-xs whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {t('nav.internalBadge')}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold hidden md:block truncate">
                  {t('nav.subtitle')}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation (Visible on xl screens and above) */}
            <nav className="hidden xl:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 backdrop-blur-sm shrink-0">
              <Link
                to="/"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive('/') && location.pathname === '/'
                    ? 'bg-white text-school-700 shadow-xs border border-slate-200/90'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-school-600 shrink-0" />
                <span>{t('nav.submitRequest')}</span>
              </Link>

              {isAdmin && (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive('/dashboard')
                        ? 'bg-white text-school-700 shadow-xs border border-slate-200/90'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                    <span>{t('nav.dashboard')}</span>
                  </Link>

                  <Link
                    to="/tickets"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive('/tickets')
                        ? 'bg-white text-school-700 shadow-xs border border-slate-200/90'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <TicketIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{t('nav.tickets')}</span>
                  </Link>

                  <Link
                    to="/labs"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive('/labs')
                        ? 'bg-white text-school-700 shadow-xs border border-slate-200/90'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 shrink-0" />
                    <span>{t('nav.labs')}</span>
                  </Link>

                  <Link
                    to="/devices"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive('/devices')
                        ? 'bg-white text-school-700 shadow-xs border border-slate-200/90'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <Server className="w-3.5 h-3.5 shrink-0" />
                    <span>{t('nav.devices')}</span>
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Desktop Right Actions (Visible ONLY on xl screens where full desktop bar is shown) */}
          <div className="hidden xl:flex items-center gap-3 shrink-0">
            <LanguageToggle variant="pill" />

            {isAdmin ? (
              <div className="flex items-center gap-2 bg-slate-50/90 hover:bg-slate-100/80 border border-slate-200/90 p-1.5 rounded-2xl shadow-xs transition-all shrink-0">
                {/* User Avatar */}
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-school-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                  {(user?.displayName?.slice(0, 2) || user?.email?.slice(0, 2) || 'IT').toUpperCase()}
                </div>

                {/* User Name & Role */}
                <div className="px-1 min-w-0 text-right rtl:text-right ltr:text-left">
                  <div className="text-xs font-black text-slate-800 truncate max-w-[90px] sm:max-w-[120px] leading-tight">
                    {user?.displayName || user?.email?.split('@')[0] || t('nav.itAdmin')}
                  </div>
                  <div className="text-[10px] text-school-600 font-bold flex items-center gap-0.5 leading-tight">
                    <Shield className="w-2.5 h-2.5 text-school-600 shrink-0" />
                    <span className="truncate">{t('nav.itAdmin')}</span>
                  </div>
                </div>

                {/* Subtle Divider */}
                <div className="w-px h-5 bg-slate-200 mx-0.5 shrink-0" />

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  title={t('nav.logout')}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5 rtl:rotate-180 shrink-0" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-school-600 to-indigo-600 hover:from-school-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-school-600/30 hover:shadow-md hover:shadow-school-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all whitespace-nowrap shrink-0"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                <span>{t('nav.login')}</span>
              </Link>
            )}
          </div>

          {/* Mobile & Tablet Top Bar Items (Visible on screens < xl) */}
          <div className="flex xl:hidden items-center gap-2 shrink-0">
            <LanguageToggle variant="compact" />

            {isAdmin && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-8 h-8 rounded-xl bg-gradient-to-tr from-school-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0 active:scale-95 transition-transform cursor-pointer"
                title={user?.displayName || 'حساب المسؤول'}
              >
                {(user?.displayName?.slice(0, 2) || user?.email?.slice(0, 2) || 'IT').toUpperCase()}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition-all border border-slate-200/80 bg-white shadow-2xs cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-fadeIn shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl bg-school-50 text-school-700 font-bold text-sm border border-school-200/70"
          >
            <PlusCircle className="w-5 h-5 text-school-600" />
            <span>{t('nav.submitRequest')}</span>
          </Link>

          {isAdmin ? (
            <>
              {/* User Profile Card in drawer */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-school-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs uppercase shadow-xs shrink-0">
                    {(user?.displayName?.slice(0, 2) || user?.email?.slice(0, 2) || 'IT')}
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-xs text-slate-900 truncate">
                      {user?.displayName || user?.email?.split('@')[0] || t('nav.itAdmin')}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate font-medium">
                      {user?.email || t('nav.authenticatedAdmin')}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-bold text-xs flex items-center gap-1.5 shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5 rtl:rotate-180" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors"
              >
                <LayoutDashboard className="w-5 h-5 text-school-600" />
                <span>{t('nav.dashboard')}</span>
              </Link>
              <Link
                to="/tickets"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors"
              >
                <TicketIcon className="w-5 h-5 text-school-600" />
                <span>{t('nav.tickets')}</span>
              </Link>
              <Link
                to="/labs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors"
              >
                <Layers className="w-5 h-5 text-school-600" />
                <span>{t('nav.labs')}</span>
              </Link>
              <Link
                to="/devices"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors"
              >
                <Server className="w-5 h-5 text-school-600" />
                <span>{t('nav.devices')}</span>
              </Link>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-school-600 to-indigo-600 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t('nav.login')}</span>
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

