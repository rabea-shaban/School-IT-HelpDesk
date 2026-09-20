import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  Globe,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { LanguageToggle } from './LanguageToggle';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith('ar') ?? true;
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

  // Prevent background scrolling when mobile sidebar is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/track' && (location.pathname === '/track' || location.pathname.startsWith('/track/'))) return true;
    if (path !== '/' && path !== '/track' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const userInitials = (user?.displayName?.slice(0, 2) || user?.email?.slice(0, 2) || 'IT').toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs select-none">
      {/* Top Brand Accent Line */}
      <div className="h-0.5 sm:h-1 w-full bg-gradient-to-r from-school-600 via-orange-500 to-indigo-600" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[4.25rem] gap-3 sm:gap-4">
          
          {/* SECTION 1: Brand & School Logo */}
          <Link to="/" className="flex items-center group shrink-0" aria-label={t('nav.title')}>
            <div className="bg-gradient-to-r from-[#061426] via-[#0b2444] to-[#0f3057] px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl border border-slate-700/80 shadow-xs flex items-center gap-2.5 sm:gap-3 group-hover:border-school-400/50 group-hover:shadow-md transition-all duration-300">
              <img
                src="/logochool.svg"
                alt="B.TECH"
                className="h-4.5 sm:h-5 w-auto object-contain"
              />
              <div className="w-px h-4 sm:h-4.5 bg-white/20" />
              <img
                src="/Ministry_of_Education_(Egypt)_logo_(wikiar).png"
                alt="وزارة التربية والتعليم"
                className="w-5.5 h-5.5 sm:w-6 sm:h-6 object-contain drop-shadow-xs"
              />
            </div>
          </Link>

          {/* SECTION 2: Center Navigation Tabs (Desktop only) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 backdrop-blur-sm shadow-2xs shrink-0">
            {/* Public Links */}
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive('/')
                  ? 'bg-white text-school-700 shadow-xs border border-slate-200/90'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>{t('nav.submitRequest')}</span>
            </Link>

            <Link
              to="/track"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive('/track')
                  ? 'bg-white text-school-700 shadow-xs border border-slate-200/90'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span>{t('nav.trackTicket')}</span>
            </Link>

            {isAdmin && (
              <>
                <div className="w-px h-3.5 bg-slate-300 mx-0.5" />

                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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

          {/* SECTION 3: Action Hub (Desktop) & Mobile Hamburger Button */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Desktop Actions (Hidden on Mobile/Tablet) */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Language Switcher */}
              <LanguageToggle variant="pill" />

              {/* Admin Profile Dropdown / Login Button */}
              {isAdmin ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-2xl hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer group active:scale-95 bg-slate-50/80 shadow-2xs"
                    aria-expanded={userDropdownOpen}
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-school-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs group-hover:ring-2 group-hover:ring-school-300 transition-all">
                      {userInitials}
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute left-0 rtl:left-0 rtl:right-auto ltr:right-0 ltr:left-auto mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-50 animate-fadeIn divide-y divide-slate-100">
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95"
                >
                  <LogIn className="w-4 h-4 shrink-0" />
                  <span>{t('nav.login')}</span>
                </Link>
              )}
            </div>

            {/* Mobile & Tablet Hamburger Button (ONLY element on mobile besides logo) */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 sm:p-2.5 rounded-2xl text-slate-700 hover:bg-slate-100 active:scale-95 transition-all border border-slate-200 bg-white shadow-2xs cursor-pointer flex items-center justify-center"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile & Tablet Off-Canvas Sidebar Drawer */}
      {mobileMenuOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] lg:hidden">
            {/* Backdrop Overlay */}
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-fadeIn"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Sliding Sidebar Panel */}
            <aside
              className={`fixed top-0 bottom-0 ${
                isArabic ? 'right-0' : 'left-0'
              } w-80 max-w-[85vw] h-[100dvh] bg-white shadow-2xl z-10 flex flex-col justify-between border-slate-200 ${
                isArabic ? 'border-l' : 'border-r'
              } overflow-hidden animate-fadeIn`}
            >
              {/* 1. Sidebar Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/80 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="bg-[#061426] px-2 py-1 rounded-xl border border-slate-700/80 shadow-xs flex items-center gap-1.5 shrink-0">
                    <img src="/logochool.svg" alt="B.TECH" className="h-3.5 w-auto object-contain" />
                    <div className="w-px h-3 bg-white/20" />
                    <img src="/Ministry_of_Education_(Egypt)_logo_(wikiar).png" alt="MOE" className="w-4 h-4 object-contain" />
                  </div>
                  <span className="font-extrabold text-xs text-slate-900 truncate">
                    {t('nav.title')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 active:scale-95 transition-all cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 2. Sidebar Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* User Profile Card (if admin) */}
                {isAdmin ? (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200/90 shadow-xs space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-school-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                        {userInitials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-slate-900 truncate">
                          {user?.displayName || user?.email?.split('@')[0] || t('nav.itAdmin')}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium truncate">
                          {user?.email || t('nav.authenticatedAdmin')}
                        </p>
                        <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded bg-school-100 text-school-700 text-[10px] font-bold">
                          <Shield className="w-2.5 h-2.5" />
                          {t('nav.itAdmin')}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full py-2 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 rtl:rotate-180" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button
                      type="button"
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>{t('nav.login')}</span>
                    </button>
                  </Link>
                )}

                {/* Quick Actions: New Ticket & Track Ticket */}
                <div className="space-y-2">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all shadow-xs ${
                      isActive('/') && location.pathname === '/'
                        ? 'bg-school-50 text-school-700 border border-school-200/80'
                        : 'bg-school-600 hover:bg-school-700 text-white shadow-school-600/20'
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                    <span>{t('nav.submitRequest')}</span>
                  </Link>

                  <Link
                    to="/track"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all border ${
                      isActive('/track')
                        ? 'bg-school-50 text-school-700 border-school-200/80 shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Search className={`w-5 h-5 ${isActive('/track') ? 'text-school-600' : 'text-slate-400'}`} />
                    <span>{t('nav.trackTicket')}</span>
                  </Link>
                </div>

                {/* Navigation Links */}
                {isAdmin && (
                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    <p className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      {t('nav.dashboard')}
                    </p>

                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                        isActive('/dashboard')
                          ? 'bg-school-50 text-school-700 border border-school-200/80'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <LayoutDashboard className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive('/dashboard') ? 'text-school-600' : 'text-slate-400'}`} />
                        <span>{t('nav.dashboard')}</span>
                      </div>
                    </Link>

                    <Link
                      to="/tickets"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                        isActive('/tickets')
                          ? 'bg-school-50 text-school-700 border border-school-200/80'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <TicketIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive('/tickets') ? 'text-school-600' : 'text-slate-400'}`} />
                        <span>{t('nav.tickets')}</span>
                      </div>
                    </Link>

                    <Link
                      to="/labs"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                        isActive('/labs')
                          ? 'bg-school-50 text-school-700 border border-school-200/80'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Layers className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive('/labs') ? 'text-school-600' : 'text-slate-400'}`} />
                        <span>{t('nav.labs')}</span>
                      </div>
                    </Link>

                    <Link
                      to="/devices"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                        isActive('/devices')
                          ? 'bg-school-50 text-school-700 border border-school-200/80'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Server className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive('/devices') ? 'text-school-600' : 'text-slate-400'}`} />
                        <span>{t('nav.devices')}</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* 3. Sidebar Bottom / Language Switcher */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-3 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <Globe className="w-4 h-4 text-school-600" />
                    <span>{t('common.language') || 'اللغة / Language'}</span>
                  </div>
                  <LanguageToggle variant="compact" />
                </div>

                <div className="text-center pt-1 border-t border-slate-200/60">
                  <p className="text-[10px] text-slate-400 font-medium">
                    {t('nav.subtitle')}
                  </p>
                </div>
              </div>
            </aside>
          </div>,
          document.body
        )}
    </header>
  );
};



