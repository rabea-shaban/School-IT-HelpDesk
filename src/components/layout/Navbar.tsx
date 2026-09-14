import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Ticket as TicketIcon,
  Server,
  Layers,
  LogOut,
  LogIn,
  Plus,
  Menu,
  X,
  Shield,
  ChevronDown,
  User,
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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const userInitials = (user?.displayName?.slice(0, 2) || user?.email?.slice(0, 2) || 'IT').toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs select-none">
      {/* Top Brand Accent Line */}
      <div className="h-0.5 sm:h-1 w-full bg-gradient-to-r from-school-600 via-orange-500 to-indigo-600" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[4.25rem] gap-4">
          
          {/* SECTION 1: Brand & School Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="bg-gradient-to-r from-[#061426] via-[#0b2444] to-[#0f3057] px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border border-slate-700/80 shadow-xs flex items-center gap-2 sm:gap-2.5 group-hover:border-school-400/50 group-hover:shadow-md transition-all duration-300">
              <img
                src="/logochool.svg"
                alt="B.TECH"
                className="h-4 sm:h-4.5 w-auto object-contain"
              />
              <div className="w-px h-3.5 sm:h-4 bg-white/20" />
              <img
                src="/Ministry_of_Education_(Egypt)_logo_(wikiar).png"
                alt="وزارة التربية والتعليم"
                className="w-5 h-5 sm:w-5.5 sm:h-5.5 object-contain drop-shadow-xs"
              />
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <span className="font-black text-xs sm:text-sm lg:text-[15px] tracking-tight text-slate-900 group-hover:text-school-600 transition-colors whitespace-nowrap leading-tight">
                {t('nav.title')}
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold whitespace-nowrap leading-tight mt-0.5">
                {t('nav.subtitle')}
              </span>
            </div>
          </Link>

          {/* SECTION 2: Center Navigation Tabs */}
          {isAdmin && (
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 backdrop-blur-sm shadow-2xs shrink-0">
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive('/dashboard')
                    ? 'bg-white text-school-700 shadow-xs border border-slate-200/90'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>{t('nav.dashboard')}</span>
              </Link>

              <Link
                to="/tickets"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive('/tickets')
                    ? 'bg-white text-school-700 shadow-xs border border-slate-200/90'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <TicketIcon className="w-4 h-4 shrink-0" />
                <span>{t('nav.tickets')}</span>
              </Link>

              <Link
                to="/labs"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive('/labs')
                    ? 'bg-white text-school-700 shadow-xs border border-slate-200/90'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span>{t('nav.labs')}</span>
              </Link>

              <Link
                to="/devices"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive('/devices')
                    ? 'bg-white text-school-700 shadow-xs border border-slate-200/90'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Server className="w-4 h-4 shrink-0" />
                <span>{t('nav.devices')}</span>
              </Link>
            </nav>
          )}

          {/* SECTION 3: Action Hub */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Switcher */}
            <LanguageToggle variant="pill" className="hidden sm:inline-flex" />
            <LanguageToggle variant="compact" className="sm:hidden" />

            {/* Admin Profile Dropdown */}
            {isAdmin ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 sm:p-1.5 rounded-2xl hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer group active:scale-95 bg-slate-50/80 shadow-2xs"
                  aria-expanded={userDropdownOpen}
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-gradient-to-tr from-school-600 to-indigo-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-xs group-hover:ring-2 group-hover:ring-school-300 transition-all">
                    {userInitials}
                  </div>
                  <div className="hidden md:block text-right rtl:text-right ltr:text-left min-w-0 pr-1 pl-1">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">
                      {user?.displayName || user?.email?.split('@')[0] || t('nav.itAdmin')}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium leading-none">
                      {t('nav.itAdmin')}
                    </p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute left-0 rtl:left-0 rtl:right-auto ltr:right-0 ltr:left-auto mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-50 animate-fadeIn divide-y divide-slate-100">
                    {/* User Info Header */}
                    <div className="px-4 py-3 text-right rtl:text-right ltr:text-left">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div className="w-8 h-8 rounded-lg bg-school-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {userInitials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-slate-900 truncate">
                            {user?.displayName || user?.email?.split('@')[0] || t('nav.itAdmin')}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium truncate">
                            {user?.email || t('nav.authenticatedAdmin')}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-school-50 text-school-700 text-[10px] font-bold border border-school-200/70">
                        <Shield className="w-3 h-3 text-school-600" />
                        {t('nav.itAdmin')}
                      </span>
                    </div>

                    {/* Quick Nav Links inside dropdown */}
                    <div className="py-1.5 px-1.5 space-y-0.5 text-right rtl:text-right ltr:text-left">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-school-600 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        <span>{t('nav.dashboard')}</span>
                      </Link>
                      <Link
                        to="/tickets"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-school-600 transition-colors"
                      >
                        <TicketIcon className="w-4 h-4 text-slate-400" />
                        <span>{t('nav.tickets')}</span>
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="p-1.5">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-right rtl:text-right ltr:text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 rtl:rotate-180 text-rose-500" />
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                <span>{t('nav.login')}</span>
              </Link>
            )}

            {/* Mobile Menu Hamburger Trigger */}
            <div className="lg:hidden">
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
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fadeIn shadow-lg">
          {isAdmin ? (
            <>
              {/* User Profile Card in mobile drawer */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-school-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs uppercase shadow-xs shrink-0">
                    {userInitials}
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
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
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
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer"
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



