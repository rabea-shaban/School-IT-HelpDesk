import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Monitor,
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-school-600 to-school-800 text-white flex items-center justify-center shadow-md shadow-school-600/20 group-hover:scale-105 transition-transform">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-school-600 transition-colors">
                  {t('nav.title')}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-school-100 text-school-800">
                  {t('nav.internalBadge')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {t('nav.subtitle')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive('/') && location.pathname === '/'
                  ? 'bg-school-50 text-school-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-school-600" />
              {t('nav.submitRequest')}
            </Link>

            {isAdmin && (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive('/dashboard')
                      ? 'bg-school-50 text-school-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t('nav.dashboard')}
                </Link>

                <Link
                  to="/tickets"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive('/tickets')
                      ? 'bg-school-50 text-school-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <TicketIcon className="w-4 h-4" />
                  {t('nav.tickets')}
                </Link>

                <Link
                  to="/labs"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive('/labs')
                      ? 'bg-school-50 text-school-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  {t('nav.labs')}
                </Link>

                <Link
                  to="/devices"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive('/devices')
                      ? 'bg-school-50 text-school-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Server className="w-4 h-4" />
                  {t('nav.devices')}
                </Link>
              </>
            )}
          </nav>

          {/* Right Action & Language Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle variant="pill" />

            {isAdmin ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200 rtl:pl-0 rtl:pr-3 rtl:border-l-0 rtl:border-r">
                <div className="text-right rtl:text-right ltr:text-left">
                  <div className="text-xs font-extrabold text-slate-800 flex items-center gap-1 justify-end rtl:justify-end ltr:justify-start">
                    <Shield className="w-3.5 h-3.5 text-school-600" />
                    {user?.displayName || user?.email?.split('@')[0] || t('nav.itAdmin')}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                    {user?.email || t('nav.authenticatedAdmin')}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  {t('nav.logout')}
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<LogIn className="w-4 h-4 text-school-600" />}
                >
                  {t('nav.login')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button & Language Switch */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageToggle variant="compact" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl bg-school-50 text-school-700 font-bold text-sm"
          >
            <PlusCircle className="w-5 h-5 text-school-600" />
            {t('nav.submitRequest')}
          </Link>

          {isAdmin ? (
            <>
              {/* User Profile Card on mobile */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-school-600 text-white font-bold flex items-center justify-center text-xs uppercase">
                  {(user?.displayName?.slice(0, 2) || user?.email?.slice(0, 2) || 'IT')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-xs text-slate-900">{user?.displayName || user?.email?.split('@')[0] || t('nav.itAdmin')}</div>
                  <div className="text-[11px] text-slate-500 truncate">{user?.email || t('nav.authenticatedAdmin')}</div>
                </div>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-semibold text-sm"
              >
                <LayoutDashboard className="w-5 h-5 text-slate-500" />
                {t('nav.dashboard')}
              </Link>
              <Link
                to="/tickets"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-semibold text-sm"
              >
                <TicketIcon className="w-5 h-5 text-slate-500" />
                {t('nav.tickets')}
              </Link>
              <Link
                to="/labs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-semibold text-sm"
              >
                <Layers className="w-5 h-5 text-slate-500" />
                {t('nav.labs')}
              </Link>
              <Link
                to="/devices"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-semibold text-sm"
              >
                <Server className="w-5 h-5 text-slate-500" />
                {t('nav.devices')}
              </Link>
              <div className="pt-3 border-t border-slate-100">
                <Button
                  variant="danger"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  {t('nav.logout')}
                </Button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="md" className="w-full" leftIcon={<LogIn className="w-4 h-4" />}>
                  {t('nav.login')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
