import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Layers,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Lab } from '../../types/lab';
import { Card } from '../ui/Card';
import { translateLabName, translateFloor } from '../../utils/i18nHelpers';

interface LabCardsProps {
  labs: Lab[];
  onSelectLab?: (labNumber: number) => void;
}

export const LabCards: React.FC<LabCardsProps> = ({ labs }) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {labs.map(lab => {
        const hasActiveIssues = lab.activeTickets > 0;
        const healthPercent = Math.round(
          ((lab.totalDevices - lab.issueDevices) / lab.totalDevices) * 100
        );
        const labName = translateLabName(lab.labNumber, isEn);
        const floorLabel = lab.floor ? translateFloor(lab.floor, isEn) : '';

        return (
          <Card
            key={lab.labNumber}
            hoverable
            className={`p-5 transition-all flex flex-col justify-between text-left rtl:text-right ${
              hasActiveIssues
                ? 'border-amber-200/80 bg-gradient-to-b from-white to-amber-50/20'
                : 'border-slate-200/80 bg-white'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl flex items-center justify-center font-bold text-sm ${
                      hasActiveIssues
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-school-50 text-school-700'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {labName}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {floorLabel ? `${floorLabel} • ` : ''}
                      {lab.labNumber === 2
                        ? `PC-LANG-01 - PC-LANG-28 (${lab.totalDevices} ${t('devices.pc')})`
                        : `PC-${String(lab.labNumber).padStart(2, '0')}-01 - PC-${String(lab.labNumber).padStart(2, '0')}-${lab.totalDevices} (${lab.totalDevices} ${t('devices.pc')})`}
                    </p>
                  </div>
                </div>

                {hasActiveIssues ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full animate-pulse-subtle">
                    <AlertCircle className="w-3 h-3" />
                    {lab.activeTickets} {t('common.issues')}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    {t('devices.operational')}
                  </span>
                )}
              </div>

              {/* Health Progress Bar */}
              <div className="space-y-1.5 my-3">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-500">{t('labs.healthStatus')}</span>
                  <span
                    className={
                      healthPercent === 100
                        ? 'text-emerald-600'
                        : healthPercent > 80
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }
                  >
                    {healthPercent}% {t('devices.operational')}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-500 ${
                      healthPercent === 100
                        ? 'bg-emerald-500'
                        : healthPercent > 80
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${healthPercent}%` }}
                  />
                </div>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-2 gap-2 py-2.5 my-2 border-t border-b border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {t('labs.totalLifetimeTickets')}
                  </span>
                  <span className="font-extrabold text-slate-800 text-sm">
                    {lab.totalTickets} {t('common.tickets')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {t('labs.resolvedTicketsCount')}
                  </span>
                  <span className="font-extrabold text-emerald-700 text-sm">
                    {lab.resolvedTickets} {t('status.resolved')}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-2">
              <Link
                to={`/devices?lab=${lab.labNumber}`}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 hover:bg-school-50 text-xs font-bold text-slate-700 hover:text-school-700 border border-slate-200/80 transition-all group"
              >
                <span>{t('labs.inspectPCs', { count: lab.totalDevices })}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
