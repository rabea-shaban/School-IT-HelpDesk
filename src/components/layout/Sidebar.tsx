import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Ticket,
  Layers,
  Server,
  PlusCircle,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const navItems = [
    {
      to: '/dashboard',
      label: t('nav.dashboard'),
      icon: <LayoutDashboard className="w-5 h-5" />,
      description: t('dashboard.subtitle'),
    },
    {
      to: '/tickets',
      label: t('nav.tickets'),
      icon: <Ticket className="w-5 h-5" />,
      description: t('common.allTicketsSubtitle'),
    },
    {
      to: '/labs',
      label: t('nav.labs'),
      icon: <Layers className="w-5 h-5" />,
      description: t('labs.subtitle'),
    },
    {
      to: '/devices',
      label: t('nav.devices'),
      icon: <Server className="w-5 h-5" />,
      description: t('devices.subtitle'),
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 hidden lg:flex border-r border-slate-800 rtl:border-r-0 rtl:border-l">
      <div className="space-y-6 text-left rtl:text-right">
        {/* Admin info badge */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-750 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-school-600 text-white flex items-center justify-center font-bold text-sm shadow-inner flex-shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider truncate">
              {user?.displayName || user?.email?.split('@')[0] || t('nav.itAdmin')}
            </h4>
            <p className="text-[11px] text-school-300 font-semibold truncate">
              {user?.email || t('nav.authenticatedAdmin')}
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
            {t('nav.dashboard')}
          </span>
          <nav className="space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-school-600 text-white shadow-md shadow-school-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Quick Links Section */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
            {t('nav.submitRequest')}
          </span>
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors"
          >
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <span>{t('nav.submitRequest')}</span>
          </NavLink>
        </div>
      </div>

      {/* Footer info in sidebar */}
      <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5 text-left rtl:text-right">
        <HelpCircle className="w-4 h-4 text-school-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          {t('dashboard.fleetSubtitle')}
        </p>
      </div>
    </aside>
  );
};
